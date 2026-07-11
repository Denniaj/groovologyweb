'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { receiptUploadSchema, type ReceiptUploadInput } from '@/lib/validations'
import { extractReceiptData } from '@/lib/receipts/gemini'
import { decideReceipt } from '@/lib/receipts/verify'
import type { ActionResult } from '@/lib/actions/types'

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
}

// ---------------------------------------------------------------------
// Subir un comprobante para un cargo: lo guarda en Storage (bucket privado),
// lo lee con Gemini y decide automáticamente si aprobar o marcar a revisión.
// El alumno solo puede subir para SUS cargos pendientes.
// ---------------------------------------------------------------------
export async function uploadReceipt(
  input: ReceiptUploadInput
): Promise<ActionResult<{ status: 'auto_approved' | 'needs_review'; reason: string | null }>> {
  const parsed = receiptUploadSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Revisa el archivo.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    }
  }
  const { charge_id, file } = parsed.data

  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) return { success: false, error: 'Debes iniciar sesión.' }

  const admin = createAdminClient()

  // El cargo debe existir, ser del alumno y estar por pagar.
  const { data: charge } = await admin
    .from('charges')
    .select('id, student_id, amount_crc, type, status, enrollment_id')
    .eq('id', charge_id)
    .maybeSingle()

  if (!charge || charge.student_id !== userId) {
    return { success: false, error: 'Cargo no encontrado.' }
  }
  if (charge.status !== 'pending' && charge.status !== 'overdue') {
    return { success: false, error: 'Este cargo ya no admite comprobantes.' }
  }

  // Subir a Storage (bucket privado 'receipts').
  const ext = EXT_BY_MIME[file.type] ?? 'bin'
  const filePath = `${userId}/${charge_id}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await admin.storage
    .from('receipts')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })
  if (uploadError) {
    return { success: false, error: 'No se pudo subir el comprobante.' }
  }

  // Leer con Gemini.
  const extracted = await extractReceiptData(buffer.toString('base64'), file.type)

  // ¿La referencia ya se usó antes? (además del índice único en la BD).
  let referenceAlreadyUsed = false
  if (extracted?.reference) {
    const { data: dup } = await admin
      .from('payment_receipts')
      .select('id')
      .eq('sinpe_reference', extracted.reference)
      .maybeSingle()
    referenceAlreadyUsed = Boolean(dup)
  }

  const decision = decideReceipt({
    expectedAmount: charge.amount_crc,
    extracted,
    referenceAlreadyUsed,
  })

  // Insertar el comprobante. Si la referencia choca con el índice único
  // (carrera concurrente), reintentar como needs_review sin referencia.
  const receiptRow = {
    charge_id,
    sinpe_reference: extracted?.reference ?? null,
    amount_crc: extracted?.amount ?? null,
    sender_name: extracted?.sender ?? null,
    payment_date: extracted?.date ?? null,
    status: decision.status,
    file_path: filePath,
  }

  let finalStatus = decision.status
  let finalReason = decision.reason
  const { error: insertError } = await admin.from('payment_receipts').insert(receiptRow)
  if (insertError) {
    if (insertError.code === '23505') {
      // Referencia duplicada detectada por la BD: nunca auto-aprobar.
      finalStatus = 'needs_review'
      finalReason = 'La referencia ya fue usada en otro pago.'
      await admin.from('payment_receipts').insert({
        ...receiptRow,
        sinpe_reference: null,
        status: 'needs_review',
      })
    } else {
      return { success: false, error: 'No se pudo registrar el comprobante.' }
    }
  }

  if (finalStatus === 'auto_approved') {
    // Marcar el cargo como pagado y activar la inscripción si era mensualidad.
    await admin.from('charges').update({ status: 'paid' }).eq('id', charge_id)
    if (charge.type === 'package' && charge.enrollment_id) {
      await admin.from('enrollments').update({ status: 'active' }).eq('id', charge.enrollment_id)
    }
    // TODO(email): enviar correo "comprobante verificado" cuando lib/email esté listo.
  } else {
    // Caso excepcional: dejar aviso para que el admin lo revise a mano.
    await admin.from('admin_notifications').insert({
      type: 'receipt_uploaded',
      message: `Comprobante para revisar: ${finalReason ?? 'requiere revisión'}`,
      reference_table: 'charges',
      reference_id: charge_id,
    })
  }

  revalidatePath('/mi-cuenta')
  return { success: true, data: { status: finalStatus, reason: finalReason } }
}
