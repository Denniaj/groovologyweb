'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { takeTrialClass } from '@/lib/actions/student'
import { Select } from '@/components/ui/Field'
import { WEEKDAYS, formatTime } from '@/lib/format'

export function LogoutButton() {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await logout() })}
      className="text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-white disabled:opacity-50"
    >
      {pending ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  )
}

export type TrialClassOption = {
  id: string
  weekday: number
  start_time: string
  dance_styles: { name: string } | null
}

// Reservar la clase de prueba gratuita (una en la vida).
export function TrialClassPicker({ classes }: { classes: TrialClassOption[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [classId, setClassId] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit() {
    if (!classId) return
    setMsg(null)
    startTransition(async () => {
      const res = await takeTrialClass({ class_id: classId })
      if (!res.success) {
        setMsg({ ok: false, text: res.error })
        return
      }
      setMsg({ ok: true, text: '¡Listo! Te esperamos en tu clase de prueba.' })
      router.refresh()
    })
  }

  return (
    <div className="border border-white/15 bg-white/[0.03] p-6">
      <h3 className="font-display text-xl uppercase tracking-wide">Tu clase de prueba es gratis</h3>
      <p className="mt-2 text-sm text-white/60">
        Como es tu primera vez, tienes una clase de prueba sin costo. Elige cuál quieres tomar.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">Elige una clase</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.dance_styles?.name} — {WEEKDAYS[c.weekday]} {formatTime(c.start_time)}
              </option>
            ))}
          </Select>
        </div>
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending || !classId}
          className="bg-white px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:opacity-50"
        >
          {pending ? 'Reservando…' : 'Reservar'}
        </button>
      </div>
      {msg && <p className={`mt-3 text-sm ${msg.ok ? 'text-green-300' : 'text-amber-300'}`}>{msg.text}</p>}
    </div>
  )
}
