import type { Metadata } from 'next'
import { getGallery } from '@/lib/data'
import { PageHero } from '@/components/site/PageHero'

export const metadata: Metadata = {
  title: 'Galería',
  description: 'Fotos de las clases, eventos y la sede de Groovology.',
}

export default async function GaleriaPage() {
  const photos = await getGallery()

  return (
    <>
      <PageHero
        eyebrow="Galería"
        title="Movimiento, flow y comunidad."
        subtitle="Momentos de nuestras clases, shows y eventos."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {photos.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="font-display text-2xl uppercase tracking-wide text-white/70">Próximamente</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
              Estamos armando la galería. Muy pronto vas a ver fotos de las clases y eventos.
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
            {photos.map((p) => (
              <figure key={p.id} className="mb-4 break-inside-avoid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.description ?? 'Groovology'} className="w-full" />
                {p.description && (
                  <figcaption className="mt-2 text-xs uppercase tracking-widest text-white/40">
                    {p.description}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
