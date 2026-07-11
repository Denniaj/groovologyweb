import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Cliente para componentes del navegador ('use client'). Usa la anon key,
// respeta la sesión del usuario. Nunca expone la service-role key.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
