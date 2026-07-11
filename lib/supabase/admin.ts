import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Cliente con service-role: SALTA RLS. Solo para tareas de servidor de
// confianza (crons, verificación de comprobantes, tareas admin). NUNCA se
// importa en código que llegue al navegador. No persiste sesión.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
