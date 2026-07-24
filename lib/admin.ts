import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Devuelve el id del usuario si es admin, o null. Para usar en server actions.
export async function currentAdminId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  return data?.role === 'admin' ? user.id : null
}

// Para páginas: exige admin o redirige. Devuelve el perfil.
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, role')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile || profile.role !== 'admin') redirect('/')
  return profile
}

// Resumen del dashboard. Usa service-role (ya se validó admin en la página).
export async function getAdminDashboard() {
  const admin = createAdminClient()
  const now = new Date()
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [unread, needsReview, chargesRes, activeStudents, trialReq] = await Promise.all([
    admin.from('admin_notifications').select('*', { count: 'exact', head: true }).eq('is_read', false),
    admin.from('payment_receipts').select('*', { count: 'exact', head: true }).eq('status', 'needs_review'),
    admin.from('charges').select('amount_crc, status, updated_at'),
    admin.from('enrollments').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    admin.from('admin_notifications').select('*', { count: 'exact', head: true }).eq('is_read', false).eq('type', 'trial_requested'),
  ])

  let ingresosMes = 0
  let pendiente = 0
  let vencido = 0
  for (const c of chargesRes.data ?? []) {
    if (c.status === 'paid' && c.updated_at >= startMonth) ingresosMes += c.amount_crc
    else if (c.status === 'pending') pendiente += c.amount_crc
    else if (c.status === 'overdue') vencido += c.amount_crc
  }

  return {
    unread: unread.count ?? 0,
    needsReview: needsReview.count ?? 0,
    trialRequests: trialReq.count ?? 0,
    activeStudents: activeStudents.count ?? 0,
    ingresosMes,
    pendiente,
    vencido,
  }
}

export async function getNotifications(limit = 25) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('admin_notifications')
    .select('*')
    .order('is_read')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}

// --- Clases ---
export async function getAdminClasses() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('classes')
    .select('id, weekday, start_time, room, level, is_kids, is_active, dance_styles(name)')
    .order('weekday')
    .order('start_time')
  return data ?? []
}

export async function getAdminClass(id: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('classes')
    .select('id, style_id, weekday, start_time, duration_minutes, room, level, is_kids')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getStylesForSelect() {
  const admin = createAdminClient()
  const { data } = await admin.from('dance_styles').select('id, name').order('sort_order')
  return data ?? []
}
