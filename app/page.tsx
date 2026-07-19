import Link from 'next/link'
import { ArrowRight, Zap, Crown, Globe, Sparkles } from 'lucide-react'
import { getStyles, getSettings } from '@/lib/data'
import { PhotoPlaceholder } from '@/components/site/PhotoPlaceholder'
import { StyleImage } from '@/components/site/StyleImage'
import { Socials } from '@/components/site/Socials'

const FEATURES = [
  { icon: Zap, title: 'Entrenamiento', text: 'Clases diseñadas para todos los niveles.' },
  { icon: Crown, title: 'Comunidad', text: 'Un ambiente seguro para crecer, crear y compartir.' },
  { icon: Globe, title: 'Experiencia', text: 'Clases guiadas por profes con pasión, técnica y trayectoria.' },
  { icon: Sparkles, title: 'Oportunidades', text: 'Compañía de competencia y proyectos reales.' },
]

export default async function HomePage() {
  const [styles, settings] = await Promise.all([getStyles(), getSettings()])
  const featured = styles.filter((s) => s.slug !== 'crew' && s.slug !== 'freestyle').slice(0, 4)

  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-white/10">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-12 lg:py-24 lg:pl-8 lg:pr-24">
          <div>
            <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Más que baile,<br />es actitud.
            </h1>
            <p className="mt-6 max-w-md text-base text-white/70">
              Estudio y compañía de bailarines en Costa Rica. Entrenamiento profesional
              en un espacio seguro para impulsar tus sueños.
            </p>
            <Link
              href="/nosotros"
              className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
            >
              Conoce más <ArrowRight size={18} />
            </Link>
          </div>

          <PhotoPlaceholder label="Groovology" className="aspect-[4/3] w-full lg:aspect-[5/4]" />
        </div>

        {/* Redes: ancladas al borde derecho de la pantalla. El pr-24 del
            contenedor deja libre esa franja, así nunca tapan la imagen. */}
        <Socials
          settings={settings}
          size={28}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-6 lg:flex"
        />
      </section>

      {/* FEATURES */}
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 py-8 sm:px-6">
              <f.icon size={26} className="mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest">{f.title}</h3>
                <p className="mt-1 text-sm text-white/60">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUESTRAS CLASES */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-12">
          <div>
            <h2 className="font-display text-4xl uppercase leading-none tracking-tight lg:text-5xl">
              Nuestras<br />clases
            </h2>
            <p className="mt-5 max-w-xs text-sm text-white/60">
              Explora estilos urbanos y encuentra tu movimiento.
            </p>
            <Link
              href="/horarios"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:text-white/70"
            >
              Ver horarios <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map((s) => (
              <Link key={s.id} href={`/clases/${s.slug}`} className="group block">
                <StyleImage slug={s.slug} name={s.name} className="aspect-[3/4] w-full" />
                <div className="mt-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl uppercase tracking-wide">{s.name}</h3>
                    <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1 whitespace-nowrap text-[11px] uppercase tracking-normal text-white/50">
                    {s.short_description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
