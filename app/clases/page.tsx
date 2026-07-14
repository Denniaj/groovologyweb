import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getStyles } from '@/lib/data'
import { StyleImage } from '@/components/site/StyleImage'

export const metadata: Metadata = {
  title: 'Clases',
  description: 'Clases de baile urbano para todos los niveles: Dancehall, Female, Heels, Hip Hop, Reggaeton, K-Pop y más.',
}

export default async function ClasesPage() {
  const styles = await getStyles()

  return (
    <>
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Clases</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
            Encuentra tu movimiento.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/70">
            Clases para todos los niveles. Diferentes estilos, un mismo lugar para crecer.
          </p>
          <Link
            href="/horarios"
            className="mt-8 inline-flex items-center gap-3 border border-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            Ver horarios <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* GRID DE ESTILOS */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {styles.map((s) => (
            <Link key={s.id} href={`/clases/${s.slug}`} className="group block">
              <StyleImage slug={s.slug} name={s.name} className="aspect-[3/4] w-full" />
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl uppercase tracking-wide">{s.name}</h2>
                  <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-1 whitespace-nowrap text-[11px] uppercase tracking-normal text-white/50">
                  {s.short_description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
