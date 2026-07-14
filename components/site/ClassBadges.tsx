import { levelLabel } from '@/lib/format'

// KIDS: badge sólido (blanco). Nivel: badge distinto (contorno). Sin badge
// para clases 'todos' (abiertas a todas las edades).
export function ClassBadges({
  isKids,
  level,
  className = '',
}: {
  isKids?: boolean | null
  level?: string | null
  className?: string
}) {
  const showLevel = level && level !== 'todos'
  if (!isKids && !showLevel) return null

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {isKids && (
        <span className="bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
          Kids
        </span>
      )}
      {showLevel && (
        <span className="border border-white/40 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70">
          {levelLabel(level!)}
        </span>
      )}
    </span>
  )
}
