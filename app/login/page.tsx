import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  description: 'Ingresa a tu cuenta de Groovology.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col justify-center px-5 py-16 lg:py-24">
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Mi cuenta</h1>
      <p className="mt-3 text-sm text-white/60">
        Ingresa para ver tus clases, tus cobros y subir tus comprobantes.
      </p>

      <div className="mt-8">
        <LoginForm />
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
