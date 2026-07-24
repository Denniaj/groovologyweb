import type { Metadata } from 'next'
import { NewPasswordForm } from '@/components/auth/NewPasswordForm'

export const metadata: Metadata = {
  title: 'Nueva contraseña',
  robots: { index: false, follow: false },
}

export default function ActualizarClavePage() {
  return (
    <section className="mx-auto flex max-w-md flex-col justify-center px-5 py-16 lg:py-24">
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight">Nueva contraseña</h1>
      <p className="mt-3 text-sm text-white/60">Escribe tu nueva contraseña para tu cuenta.</p>

      <div className="mt-8">
        <NewPasswordForm />
      </div>
    </section>
  )
}
