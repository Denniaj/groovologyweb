import type { Metadata } from 'next'
import Link from 'next/link'
import { ForgotForm } from '@/components/auth/ForgotForm'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  robots: { index: false, follow: false },
}

export default function RecuperarPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col justify-center px-5 py-16 lg:py-24">
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Recuperar contraseña</h1>
      <p className="mt-3 text-sm text-white/60">
        Escribe tu correo y te enviamos un enlace para crear una nueva contraseña.
      </p>

      <div className="mt-8">
        <ForgotForm />
      </div>

      <p className="mt-8 text-sm text-white/60">
        <Link href="/login" className="font-semibold text-white underline underline-offset-4">
          Volver a iniciar sesión
        </Link>
      </p>
    </section>
  )
}
