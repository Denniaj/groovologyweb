import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAdminClasses } from '@/lib/admin'
import { ClassBadges } from '@/components/site/ClassBadges'
import { DeleteClassButton } from '@/components/admin/ClassActions'
import { WEEKDAYS, WEEK_ORDER, formatTime } from '@/lib/format'

export default async function AdminClasesPage() {
  const classes = await getAdminClasses()
  const days = WEEK_ORDER.map((wd) => ({
    wd,
    items: classes.filter((c) => c.weekday === wd),
  })).filter((d) => d.items.length > 0)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase tracking-tight">Clases y horarios</h1>
        <Link
          href="/admin/clases/nueva"
          className="inline-flex items-center gap-2 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85"
        >
          <Plus size={16} /> Nueva clase
        </Link>
      </div>

      {classes.length === 0 ? (
        <p className="mt-8 text-sm text-white/50">
          Todavía no hay clases. Agrega la primera con “Nueva clase”.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {days.map(({ wd, items }) => (
            <div key={wd}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">{WEEKDAYS[wd]}</h2>
              <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
                {items.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="w-20 text-sm text-white/60">{formatTime(c.start_time)}</span>
                      <span className="font-display text-lg uppercase tracking-wide">{c.dance_styles?.name}</span>
                      <ClassBadges isKids={c.is_kids} level={c.level} />
                      <span className="text-xs uppercase tracking-widest text-white/30">{c.room}</span>
                      {!c.is_active && (
                        <span className="text-[10px] uppercase tracking-widest text-amber-300">Inactiva</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/clases/${c.id}`}
                        className="text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white"
                      >
                        Editar
                      </Link>
                      <DeleteClassButton id={c.id} />
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
