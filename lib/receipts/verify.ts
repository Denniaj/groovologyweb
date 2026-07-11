import type { ExtractedReceipt } from '@/lib/receipts/gemini'

// Los colones son enteros y el monto SINPE debe coincidir exacto. Sin
// tolerancia: si no cuadra, va a revisión manual (nunca se auto-aprueba).
const AMOUNT_TOLERANCE_CRC = 0

export type ReceiptDecision = {
  status: 'auto_approved' | 'needs_review'
  reason: string | null // por qué quedó en revisión (null si se auto-aprobó)
}

// Decide automáticamente el destino del comprobante. Función PURA: no toca
// la base de datos, solo aplica las reglas. Un comprobante solo se
// auto-aprueba si es legible, el monto coincide y la referencia es nueva.
export function decideReceipt(params: {
  expectedAmount: number
  extracted: ExtractedReceipt | null
  referenceAlreadyUsed: boolean
}): ReceiptDecision {
  const { expectedAmount, extracted, referenceAlreadyUsed } = params

  if (!extracted) {
    return { status: 'needs_review', reason: 'No se pudo leer el comprobante.' }
  }
  if (!extracted.isReceipt) {
    return { status: 'needs_review', reason: 'La imagen no parece un comprobante SINPE.' }
  }
  if (!extracted.reference) {
    return { status: 'needs_review', reason: 'No se detectó la referencia SINPE.' }
  }
  if (referenceAlreadyUsed) {
    return { status: 'needs_review', reason: 'La referencia ya fue usada en otro pago.' }
  }
  if (extracted.amount == null) {
    return { status: 'needs_review', reason: 'No se detectó el monto.' }
  }
  if (Math.abs(extracted.amount - expectedAmount) > AMOUNT_TOLERANCE_CRC) {
    return {
      status: 'needs_review',
      reason: `El monto (₡${extracted.amount}) no coincide con el cargo (₡${expectedAmount}).`,
    }
  }
  return { status: 'auto_approved', reason: null }
}
