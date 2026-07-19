import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, Crown, Globe, Sparkles } from 'lucide-react'
import { PageHero } from '@/components/site/PageHero'
import { PhotoPlaceholder } from '@/components/site/PhotoPlaceholder'

export const metadata: Metadata = {
  title: 'Nosotros',
  description:
    'Groovology es una academia y crew de danza urbana en Cartago, Costa Rica: un espacio para crecer, crear e inspirar.',
}

const PILARES = [
  { icon: Zap, title: 'Entrenamiento', text: 'Clases diseñadas para todos los niveles.' },
  { icon: Crown, title: 'Comunidad', text: 'Un ambiente seguro para crecer, crear y compartir.' },
  { icon: Globe, title: 'Experiencia', text: 'Clases guiadas por profes con pasión, técnica y trayectoria.' },
  { icon: Sparkles, title: 'Oportunidades', text: 'Compañía de competencia y proyectos reales.' },
]

const VALORES = [
  { title: 'Actitud', text: 'Bailamos con confianza y pasión.' },
  { title: 'Autenticidad', text: 'Somos reales, sin filtros.' },
  { title: 'Pertenencia', text: 'Un crew, una familia.' },
  { title: 'Disciplina', text: 'Trabajo constante, resultados reales.' },
  { title: 'Creatividad', text: 'Innovamos, exploramos, rompemos límites.' },
]

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title="Más que una academia, somos una comunidad."
        subtitle="Groovology nació con la visión de crear un espacio seguro y profesional para formar bailarines con disciplina, pasión y propósito. Aquí no solo aprendes a bailar: construyes tu identidad y creas conexiones reales."
      />

      {/* CRECER / CREAR / INSPIRAR */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <PhotoPlaceholder label="Groovology" className="aspect-[4/3] w-full" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Nuestra esencia</p>
            <p className="mt-5 font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
              Crecer.<br />Crear.<br />Inspirar.
            </p>
            <p className="mt-6 max-w-md text-base text-white/70">
              Un espacio para crecer, crear y moverte con propósito, dentro de una
              comunidad que impulsa tu proceso artístico.
            </p>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {PILARES.map((p) => (
            <div key={p.title} className="flex gap-4">
              <p.icon size={26} className="mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest">{p.title}</h2>
                <p className="mt-1 text-sm text-white/60">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALORES */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <h2 className="font-display text-3xl uppercase tracking-tight lg:text-4xl">Cómo somos</h2>
        <div className="mt-10 grid grid-cols-1 gap-px border border-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {VALORES.map((v) => (
            <div key={v.title} className="bg-white/[0.02] p-6">
              <h3 className="font-display text-xl uppercase tracking-wide">{v.title}</h3>
              <p className="mt-2 text-sm text-white/60">{v.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/clases"
            className="inline-flex items-center gap-3 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
          >
            Ver clases <ArrowRight size={18} />
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center gap-3 border border-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            Inscríbete
          </Link>
        </div>
      </section>
    </>
  )
}
