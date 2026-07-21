'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { logout } from '@/lib/actions/auth'

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/pagos', label: 'Pagos' },
  { href: '/admin/alumnos', label: 'Alumnos' },
  { href: '/admin/clases', label: 'Clases y horarios' },
  { href: '/admin/instructores', label: 'Instructores' },
  { href: '/admin/crew', label: 'Crew' },
  { href: '/admin/galeria', label: 'Galería' },
  { href: '/admin/paquetes', label: 'Paquetes' },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

function active(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const params = useSearchParams()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState(params.get('q') ?? '')

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin/alumnos?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }

  const links = (
    <>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={`block px-4 py-2.5 text-sm uppercase tracking-widest transition-colors ${
            active(pathname, item.href)
              ? 'bg-white text-black'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* Barra superior (siempre visible) */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-[#0a0a0a] px-4 py-3 lg:px-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
          className="lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link href="/admin" className="font-display text-lg uppercase tracking-wide">
          Panel
        </Link>

        <form onSubmit={onSearch} className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar alumno…"
              className="w-40 border border-white/20 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-white focus:outline-none sm:w-56"
            />
          </div>
        </form>
      </div>

      {/* Menú móvil desplegable */}
      {open && (
        <nav className="border-b border-white/10 bg-[#0a0a0a] py-2 lg:hidden">
          {links}
          <button
            type="button"
            onClick={() => logout()}
            className="block w-full px-4 py-2.5 text-left text-sm uppercase tracking-widest text-white/40 hover:text-white"
          >
            Cerrar sesión
          </button>
        </nav>
      )}
    </>
  )
}

// Barra lateral para escritorio.
export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden w-60 shrink-0 border-r border-white/10 lg:block">
      <nav className="sticky top-[57px] py-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-2.5 text-sm uppercase tracking-widest transition-colors ${
              active(pathname, item.href)
                ? 'bg-white text-black'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => logout()}
          className="mt-4 block w-full px-6 py-2.5 text-left text-sm uppercase tracking-widest text-white/40 hover:text-white"
        >
          Cerrar sesión
        </button>
      </nav>
    </aside>
  )
}
