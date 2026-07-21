import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { getSettings } from '@/lib/data'
import { PageHero } from '@/components/site/PageHero'
import { Socials } from '@/components/site/Socials'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Escríbenos por WhatsApp o visítanos en Cartago, El Molino. Groovology.',
}

export default async function ContactoPage() {
  const settings = await getSettings()
  const whatsapp = settings?.whatsapp
    ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`
    : null
  const mapsUrl =
    settings?.google_maps_url ??
    (settings?.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
      : null)

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos."
        subtitle="¿Dudas sobre clases, horarios o inscripciones? Escríbenos y te ayudamos."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-px border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.06]"
            >
              <MessageCircle size={26} strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest">WhatsApp</h2>
              <p className="mt-1 text-sm text-white/60">{settings?.whatsapp}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
                Escribir <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          )}

          {settings?.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="group bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.06]"
            >
              <Mail size={26} strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest">Correo</h2>
              <p className="mt-1 text-sm text-white/60">{settings.contact_email}</p>
            </a>
          )}

          {settings?.address && (
            <a
              href={mapsUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="group bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.06]"
            >
              <MapPin size={26} strokeWidth={1.5} />
              <h2 className="mt-4 text-sm font-semibold uppercase tracking-widest">Ubicación</h2>
              <p className="mt-1 text-sm text-white/60">{settings.address}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
                Ver en el mapa <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Síguenos</h2>
            <Socials settings={settings} size={22} className="mt-4" />
          </div>
          <Link
            href="/registro"
            className="inline-flex items-center gap-3 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
          >
            Inscríbete <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
