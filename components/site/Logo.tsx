'use client'

import { useState } from 'react'

// Muestra el logo (public/logo.png). Si aún no está el archivo, cae a un
// texto en la tipografía display para no romper el layout.
export function Logo({ className = '' }: { className?: string }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <span className="font-display text-2xl uppercase tracking-tight text-white">
        Groovology
      </span>
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/logo.png"
      alt="Groovology"
      className={className}
      onError={() => setError(true)}
    />
  )
}
