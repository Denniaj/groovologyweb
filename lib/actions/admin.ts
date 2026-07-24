'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { currentAdminId } from '@/lib/admin'
import { classFormSchema, type ClassFormInput } from '@/lib/validations'
import type { ActionResult } from '@/lib/actions/types'

function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[]>
}

function revalidateSchedule() {
  revalidatePath('/admin/clases')
  revalidatePath('/horarios')
  revalidatePath('/clases')
}

// Marca una notificación como leída.
export async function markNotificationRead(id: string): Promise<ActionResult> {
  const adminId = await currentAdminId()
  if (!adminId) return { success: false, error: 'No autorizado.' }

  const admin = createAdminClient()
  const { error } = await admin.from('admin_notifications').update({ is_read: true }).eq('id', id)
  if (error) return { success: false, error: 'No se pudo actualizar.' }

  revalidatePath('/admin')
  return { success: true, data: undefined }
}

// Marca todas como leídas.
export async function markAllNotificationsRead(): Promise<ActionResult> {
  const adminId = await currentAdminId()
  if (!adminId) return { success: false, error: 'No autorizado.' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_notifications')
    .update({ is_read: true })
    .eq('is_read', false)
  if (error) return { success: false, error: 'No se pudo actualizar.' }

  revalidatePath('/admin')
  return { success: true, data: undefined }
}

// ---------------------------------------------------------------------
// Clases (horario)
// ---------------------------------------------------------------------
export async function createClass(input: ClassFormInput): Promise<ActionResult<{ id: string }>> {
  const adminId = await currentAdminId()
  if (!adminId) return { success: false, error: 'No autorizado.' }

  const parsed = classFormSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('classes')
    .insert({ ...parsed.data, capacity: 100 })
    .select('id')
    .single()
  if (error) return { success: false, error: 'No se pudo crear la clase.' }

  revalidateSchedule()
  return { success: true, data: { id: data.id } }
}

export async function updateClass(id: string, input: ClassFormInput): Promise<ActionResult> {
  const adminId = await currentAdminId()
  if (!adminId) return { success: false, error: 'No autorizado.' }

  const parsed = classFormSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Revisa los campos.', fieldErrors: fieldErrors(parsed.error) }
  }

  const admin = createAdminClient()
  const { error } = await admin.from('classes').update(parsed.data).eq('id', id)
  if (error) return { success: false, error: 'No se pudo guardar la clase.' }

  revalidateSchedule()
  return { success: true, data: undefined }
}

export async function deleteClass(id: string): Promise<ActionResult> {
  const adminId = await currentAdminId()
  if (!adminId) return { success: false, error: 'No autorizado.' }

  const admin = createAdminClient()
  const { error } = await admin.from('classes').delete().eq('id', id)
  if (error) {
    // FK: la clase tiene alumnos inscritos.
    if (error.code === '23503') {
      return {
        success: false,
        error: 'No se puede eliminar: hay alumnos inscritos en esta clase.',
      }
    }
    return { success: false, error: 'No se pudo eliminar la clase.' }
  }

  revalidateSchedule()
  return { success: true, data: undefined }
}
