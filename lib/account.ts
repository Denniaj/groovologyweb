import { createClient } from '@/lib/supabase/server'

// Lecturas del alumno autenticado. RLS garantiza que solo vea lo suyo.

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export async function getMyProfile(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  return data
}

export async function getMyEnrollments(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(
      'id, status, start_date, end_date, minor_name, packages(name, price_crc), enrollment_classes(classes(id, weekday, start_time, room, level, is_kids, dance_styles(name, slug)))'
    )
    .eq('student_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getMyCharges(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('charges')
    .select('id, type, description, amount_crc, due_date, status, payment_receipts(status, created_at)')
    .eq('student_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function getMyEvents(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('event_participants')
    .select('id, events(id, name, event_date, description)')
    .eq('student_id', userId)
  return data ?? []
}

// ¿Ya usó su clase de prueba gratuita? (una en la vida)
export async function getMyTrial(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trial_classes')
    .select('id, taken_at, classes(dance_styles(name))')
    .eq('student_id', userId)
    .maybeSingle()
  return data
}
