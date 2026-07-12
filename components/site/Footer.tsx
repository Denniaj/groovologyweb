import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Logo } from '@/components/site/Logo'
import { Socials } from '@/components/site/Socials'

type Settings = {
  instagram?: string | null
  tiktok?: string | null
  facebook?: string | null
  whatsapp?: string | null
  address?: string | null
} | null

const COLS = [
  {
    title: 'Academia',
    links: [
      { href: '/clases', label: 'Clases' },
      { href: '/horarios', label: 'Horarios' },
      { href: '/crew', label: 'Crew' },
      { href: '/galeria', label: 'Galería' },
    ],
  },
  {
    title: 'Groovology',
    links: [
      { href: '/nosotros', label: 'Nosotros' },
      { href: '/contacto', label: 'Contacto' },
      { href: '/registro', label: 'Inscríbete' },
      { href: '/login', label: 'Mi cuenta' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/legal/privacidad', label: 'Privacidad' },
      { href: '/legal/terminos', label: 'Términos' },
      { href: '/legal/cancelacion', label: 'Cancelación' },
    ],
  },
]

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-white/60">
              Un espacio para crecer, crear y moverte con propósito, dentro de una
              comunidad que impulsa tu proceso artístico.
            </p>
            {settings?.address && (
              <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                {settings.address}
              </p>
            )}
            <Socials settings={settings} className="mt-5" />
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Groovology. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
