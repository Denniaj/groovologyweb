import { createClient } from '@/lib/supabase/server'

// Lecturas públicas del sitio (respetan RLS: catálogo es de lectura pública).

export async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
  return data
}

export async function getStyles() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('dance_styles')
    .select('*')
    .order('sort_order')
  return data ?? []
}

export async function getStyleBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('dance_styles').select('*').eq('slug', slug).maybeSingle()
  return data
}

export async function getInstructors() {
  const supabase = await createClient()
  const { data } = await supabase.from('instructors').select('*').order('sort_order')
  return data ?? []
}

export async function getCrewMembers() {
  const supabase = await createClient()
  const { data } = await supabase.from('crew_members').select('*').order('sort_order')
  return data ?? []
}

export async function getPackages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return data ?? []
}

// Clases activas con el nombre y slug de su estilo e instructor.
export async function getClasses() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('classes')
    .select('*, dance_styles(name, slug), instructors(name)')
    .eq('is_active', true)
    .order('weekday')
    .order('start_time')
  return data ?? []
}

export async function getOpenEvents() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('id, name, description, event_date, photo_url')
    .eq('status', 'open')
    .order('event_date')
  return data ?? []
}

export async function getGallery() {
  const supabase = await createClient()
  const { data } = await supabase.from('gallery_photos').select('*').order('sort_order')
  return data ?? []
}
