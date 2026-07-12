'use client'

import { useState } from 'react'
import { PhotoPlaceholder } from '@/components/site/PhotoPlaceholder'

// Muestra la foto del estilo (public/styles/<slug>.jpg). Si aún no existe,
// cae al placeholder oscuro. Así el admin/nosotros vamos agregando fotos
// sin tocar la base de datos.
export function StyleImage({
  slug,
  name,
  className = '',
}: {
  slug: string
  name: string
  className?: string
}) {
  const [error, setError] = useState(false)

  if (error) {
    return <PhotoPlaceholder label={name} className={className} />
  }

  return (
    <div className={`relative overflow-hidden bg-neutral-900 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/styles/${slug}.jpg`}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover grayscale"
        onError={() => setError(true)}
      />
    </div>
  )
}
