import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Procesa el enlace de recuperación: canjea el código por una sesión y lleva
// al usuario a poner su nueva contraseña.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/actualizar-clave`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=reset`)
}
