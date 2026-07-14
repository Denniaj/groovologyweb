import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, MapPin, Sparkles, MessageCircle } from 'lucide-react'
import { getClasses, getSettings } from '@/lib/data'
import { PhotoPlaceholder } from '@/components/site/PhotoPlaceholder'
import { Schedule, type ScheduleClass } from '@/components/site/Schedule'

export const metadata: Metadata = {
  title: 'Horarios',
  description: 'Programación semanal de clases de Groovology. Encuentra la clase perfecta para ti.',
}

export default async function HorariosPage() {
  const [classes, settings] = await Promise.all([getClasses(), getSettings()])

  const scheduleClasses: ScheduleClass[] = classes.map((c) => ({
    id: c.id,
    weekday: c.weekday,
    start_time: c.start_time,
    room: c.room,
    level: c.level,
    is_kids: c.is_kids,
    dance_styles: c.dance_styles
      ? { name: c.dance_styles.name, slug: c.dance_styles.slug }
      : null,
  }))

  const whatsapp = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null

  const info = [
    { icon: Sparkles, title: 'Prueba una clase', text: 'Primera clase gratis para nuevos estudiantes.' },
    { icon: Clock, title: 'Duración', text: 'Todas las clases duran 1 hora.' },
    { icon: MapPin, title: 'Ubicación', text: settings?.address ?? 'Cartago, El Molino. Groovology' },
    { icon: MessageCircle, title: '¿Dudas?', text: 'Escríbenos por WhatsApp y te ayudamos.' },
  ]

  return (
    <>
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Horarios</p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
              Organiza tu semana. Entrena tu pasión.
            </h1>
            <p className="mt-5 max-w-md text-base text-white/70">
              Explora nuestra programación y encuentra la clase perfecta para ti.
            </p>
            <Link
              href="/clases"
              className="mt-8 inline-flex items-center gap-3 border border-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
            >
              Ver clases <ArrowRight size={18} />
            </Link>
          </div>
          <PhotoPlaceholder label="Groovology" className="aspect-[4/3] w-full" />
        </div>
      </section>

      {/* GRILLA */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <Schedule classes={scheduleClasses} />
      </section>

      {/* BARRA DE INFO */}
      <section className="border-t border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {info.map((i) => (
            <div key={i.title} className="flex gap-4">
              <i.icon size={24} className="mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest">{i.title}</h3>
                {i.title === '¿Dudas?' && whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-white/60 underline-offset-4 hover:underline">
                    {i.text}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-white/60">{i.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
