'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClassBadges } from '@/components/site/ClassBadges'
import { WEEKDAYS, WEEK_ORDER, formatTime } from '@/lib/format'

export type ScheduleClass = {
  id: string
  weekday: number
  start_time: string
  room: string | null
  level: string
  is_kids: boolean
  dance_styles: { name: string; slug: string } | null
}

const FILTERS = [
  { key: 'todas', label: 'Todas las clases' },
  { key: 'peques', label: 'Peques' },
  { key: 'principiante', label: 'Principiante' },
  { key: 'intermedio', label: 'Intermedio' },
  { key: 'avanzado', label: 'Avanzado' },
] as const

type FilterKey = (typeof FILTERS)[number]['key']

function matches(c: ScheduleClass, f: FilterKey) {
  if (f === 'todas') return true
  if (f === 'peques') return c.is_kids
  return c.level === f
}

export function Schedule({ classes }: { classes: ScheduleClass[] }) {
  const [filter, setFilter] = useState<FilterKey>('todas')
  const filtered = classes.filter((c) => matches(c, filter))
  const days = WEEK_ORDER.map((wd) => ({
    wd,
    items: filtered.filter((c) => c.weekday === wd),
  })).filter((d) => d.items.length > 0)

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              filter === f.key
                ? 'border-white bg-white text-black'
                : 'border-white/25 text-white/70 hover:border-white hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grilla por día */}
      {days.length === 0 ? (
        <p className="mt-10 text-white/50">No hay clases para este filtro.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {days.map(({ wd, items }) => (
            <div key={wd} className="border border-white/10 bg-white/[0.02]">
              <h3 className="border-b border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-widest">
                {WEEKDAYS[wd]}
              </h3>
              <ul className="divide-y divide-white/5">
                {items.map((c) => (
                  <li key={c.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={c.dance_styles ? `/clases/${c.dance_styles.slug}` : '#'}
                        className="font-display text-lg uppercase tracking-wide transition-colors hover:text-white/70"
                      >
                        {c.dance_styles?.name ?? 'Clase'}
                      </Link>
                      <span className="shrink-0 text-sm text-white/60">{formatTime(c.start_time)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <ClassBadges isKids={c.is_kids} level={c.level} />
                      <span className="text-[11px] uppercase tracking-widest text-white/30">{c.room}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
