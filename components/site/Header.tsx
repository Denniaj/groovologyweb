'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/site/Logo'
import { logout } from '@/lib/actions/auth'

type Viewer = { isAdmin: boolean } | null

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/clases', label: 'Clases' },
  { href: '/horarios', label: 'Horarios' },
  { href: '/crew', label: 'Crew' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
]

function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function Header({ viewer }: { viewer?: Viewer }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()

  const accountHref = viewer ? (viewer.isAdmin ? '/admin' : '/mi-cuenta') : '/login'
  function doLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="Groovology — inicio" className="shrink-0">
          <Logo className="h-11 w-auto" />
        </Link>

        {/* Nav escritorio */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                isActive(pathname, item.href)
                  ? 'text-white underline decoration-2 underline-offset-8'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={accountHref}
            className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:text-white sm:flex"
          >
            <UserIcon /> Mi cuenta
          </Link>
          {viewer ? (
            <button
              type="button"
              onClick={doLogout}
              className="hidden border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:border-white hover:text-white sm:inline-block"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/registro"
              className="hidden border border-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black sm:inline-block"
            >
              Inscríbete
            </Link>
          )}
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setOpen((v) => !v)}
            className="text-white lg:hidden"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className="border-t border-white/10 bg-[#0a0a0a] px-5 pb-6 pt-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-medium uppercase tracking-widest ${
                isActive(pathname, item.href) ? 'text-white' : 'text-white/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center gap-2 py-3 text-sm font-semibold uppercase tracking-widest text-white/80"
          >
            <UserIcon /> Mi cuenta
          </Link>
          {viewer ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                doLogout()
              }}
              className="mt-3 block w-full border border-white/30 px-5 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white/80"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="mt-3 block border border-white px-5 py-3 text-center text-sm font-semibold uppercase tracking-widest"
            >
              Inscríbete
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
