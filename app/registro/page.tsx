import type { Metadata } from 'next'
import Link from 'next/link'
import { getPackages, getClasses, getOpenEvents } from '@/lib/data'
import { RegisterForm, type ClassOption } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscríbete',
  description: 'Crea tu cuenta en Groovology y elige tus clases.',
  robots: { index: false, follow: false },
}

export default async function RegistroPage() {
  const [packages, classes, events] = await Promise.all([
    getPackages(),
    getClasses(),
    getOpenEvents(),
  ])

  const classOptions: ClassOption[] = classes.map((c) => ({
    id: c.id,
    weekday: c.weekday,
    start_time: c.start_time,
    level: c.level,
    is_kids: c.is_kids,
    dance_styles: c.dance_styles ? { name: c.dance_styles.name } : null,
  }))

  return (
    <section className="mx-auto max-w-3xl px-5 py-14 lg:py-20">
      <h1 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
        Inscríbete
      </h1>
      <p className="mt-3 max-w-lg text-sm text-white/60">
        Crea tu cuenta para reservar tus clases, ver tus cobros y subir tus comprobantes.
      </p>

      <div className="mt-10">
        <RegisterForm
          packages={packages.map((p) => ({
            id: p.id,
            name: p.name,
            price_crc: p.price_crc,
            duration_days: p.duration_days,
            frequency: p.frequency,
          }))}
          classes={classOptions}
          events={events.map((e) => ({ id: e.id, name: e.name }))}
        />
      </div>

      <p className="mt-8 text-sm text-white/60">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-semibold text-white underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </section>
  )
}
