'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { currentAdminId } from '@/lib/admin'
import type { ActionResult } from '@/lib/actions/types'

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
