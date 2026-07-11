import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

// Cliente para Server Components, Server Actions y Route Handlers.
// En Next 16 `cookies()` es async, por eso la función es async y se await-ea.
// Usa la anon key + la sesión en cookies (respeta RLS cuando llegue en Fase 3).
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll llamado desde un Server Component: no se pueden escribir
            // cookies durante el render. El refresco de sesión lo hace el
            // proxy (proxy.ts), así que aquí se ignora sin problema.
          }
        },
      },
    }
  )
}
