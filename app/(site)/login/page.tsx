import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getViewer } from '@/lib/account'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Ingresa a tu cuenta de Groovology.',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  // Si ya tiene sesión, no mostramos el login: al panel o a su cuenta.
  const viewer = await getViewer()
  if (viewer) redirect(viewer.isAdmin ? '/admin' : '/mi-cuenta')

  return (
    <section className="mx-auto flex max-w-md flex-col justify-center px-5 py-16 lg:py-24">
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Mi cuenta</h1>
      <p className="mt-3 text-sm text-white/60">
        Ingresa para ver tus clases, tus cobros y subir tus comprobantes.
      </p>

      <div className="mt-8">
        <LoginForm />
      </div>

      <div className="mt-6">
        <Link href="/recuperar" className="text-sm text-white/50 underline underline-offset-4 hover:text-white">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <p className="mt-8 text-sm text-white/60">
        ¿Todavía no tienes cuenta?{' '}
        <Link href="/registro" className="font-semibold text-white underline underline-offset-4">
          Inscríbete
        </Link>
      </p>
    </section>
  )
}
