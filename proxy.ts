import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// En Next 16 el antiguo `middleware` se llama `proxy` (runtime nodejs).
// Refresca la sesión de Supabase en cada request que no sea un asset.
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Todo menos assets estáticos, imágenes optimizadas y archivos con extensión.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
