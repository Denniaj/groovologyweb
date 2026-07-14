import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getStyleBySlug, getClassesForStyle } from '@/lib/data'
import { StyleImage } from '@/components/site/StyleImage'
import { ClassBadges } from '@/components/site/ClassBadges'
import { WEEKDAYS, formatTime } from '@/lib/format'

export async function generateMetadata(props: PageProps<'/clases/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const style = await getStyleBySlug(slug)
  if (!style) return { title: 'Clase no encontrada' }
  return {
    title: style.name,
    description: style.short_description ?? undefined,
  }
}

export default async function StyleDetailPage(props: PageProps<'/clases/[slug]'>) {
  const { slug } = await props.params
  const style = await getStyleBySlug(slug)
  if (!style) notFound()

  const classes = await getClassesForStyle(style.id)

  return (
    <>
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <div>
            <Link href="/clases" className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white">
              ← Clases
            </Link>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl">
              {style.name}
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-white/50">
              {style.short_description}
            </p>
            {style.long_description && (
              <p className="mt-6 max-w-md text-base text-white/70">{style.long_description}</p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/registro"
                className="inline-flex items-center gap-3 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
              >
                Inscríbete <ArrowRight size={18} />
              </Link>
              <Link
                href="/horarios"
                className="inline-flex items-center gap-3 border border-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
              >
                Ver horarios
              </Link>
            </div>
          </div>

          <StyleImage slug={style.slug} name={style.name} className="aspect-[4/5] w-full" />
        </div>
      </section>

      {/* HORARIO DE ESTE ESTILO */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <h2 className="font-display text-3xl uppercase tracking-tight lg:text-4xl">Horario</h2>
        {classes.length === 0 ? (
          <p className="mt-6 text-white/50">Horario próximamente.</p>
        ) : (
          <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {classes.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-4">
                  <span className="w-24 text-sm font-semibold uppercase tracking-widest">{WEEKDAYS[c.weekday]}</span>
                  <span className="text-sm text-white/70">{formatTime(c.start_time)}</span>
                  <ClassBadges isKids={c.is_kids} level={c.level} />
                </div>
                <span className="text-xs uppercase tracking-widest text-white/40">{c.room}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
