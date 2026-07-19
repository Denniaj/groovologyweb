import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCrewMembers } from '@/lib/data'
import { PageHero } from '@/components/site/PageHero'
import { PhotoPlaceholder } from '@/components/site/PhotoPlaceholder'

export const metadata: Metadata = {
  title: 'Crew',
  description: 'El equipo competitivo de Groovology: entrenamiento, shows y competencias.',
}

export default async function CrewPage() {
  const members = await getCrewMembers()

  return (
    <>
      <PageHero
        eyebrow="Crew"
        title="Un crew, una familia."
        subtitle="Nuestro equipo competitivo: entrenamiento constante, shows y competencias. Disciplina y flow que se construyen juntos."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {members.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="font-display text-2xl uppercase tracking-wide text-white/70">Próximamente</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
              Estamos preparando la presentación del crew. Muy pronto vas a conocer al equipo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {members.map((m) => (
              <div key={m.id}>
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo_url} alt={m.name} className="aspect-[3/4] w-full object-cover" />
                ) : (
                  <PhotoPlaceholder label={m.name} className="aspect-[3/4] w-full" />
                )}
                <h2 className="mt-3 font-display text-xl uppercase tracking-wide">{m.name}</h2>
                {m.bio && <p className="mt-1 text-sm text-white/60">{m.bio}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 border border-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
          >
            Quiero saber más <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
