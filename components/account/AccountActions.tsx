'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import {
  takeTrialClass,
  bookExtraClass,
  cancelEnrollment,
  updateProfile,
} from '@/lib/actions/student'
import { Label, Input, Select } from '@/components/ui/Field'
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

// Reservar una clase suelta (₡2 000) durante la semana de prueba.
export function ExtraClassPicker({ classes }: { classes: TrialClassOption[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [classId, setClassId] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit() {
    if (!classId) return
    setMsg(null)
    startTransition(async () => {
      const res = await bookExtraClass({ class_id: classId })
      if (!res.success) {
        setMsg({ ok: false, text: res.error })
        return
      }
      setMsg({ ok: true, text: 'Clase suelta reservada. Genera un cobro de ₡2 000 en Mis cobros.' })
      setClassId('')
      router.refresh()
    })
  }

  return (
    <div className="border border-white/15 bg-white/[0.03] p-6">
      <h3 className="font-display text-xl uppercase tracking-wide">Reserva clases sueltas</h3>
      <p className="mt-2 text-sm text-white/60">
        Antes de elegir un paquete puedes tomar clases sueltas a <strong>₡2 000</strong> cada una.
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
          className="border border-white px-6 py-3 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white hover:text-black disabled:opacity-50"
        >
          {pending ? 'Reservando…' : 'Reservar (₡2 000)'}
        </button>
      </div>
      {msg && <p className={`mt-3 text-sm ${msg.ok ? 'text-green-300' : 'text-amber-300'}`}>{msg.text}</p>}
    </div>
  )
}

// Cancelar una inscripción (con confirmación).
export function CancelEnrollmentButton({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    if (!confirm('¿Seguro que quieres cancelar esta inscripción? Se cancelarán sus cobros pendientes.')) return
    startTransition(async () => {
      await cancelEnrollment({ enrollment_id: enrollmentId })
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-xs font-semibold uppercase tracking-widest text-white/40 transition-colors hover:text-red-300 disabled:opacity-50"
    >
      {pending ? 'Cancelando…' : 'Cancelar'}
    </button>
  )
}

// Editar nombre, apellidos y teléfono del perfil.
export function EditProfile({
  profile,
}: {
  profile: { first_name: string; last_name: string; phone: string | null }
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  function onSubmit(formData: FormData) {
    setErrors({})
    startTransition(async () => {
      const res = await updateProfile({
        first_name: String(formData.get('first_name') ?? ''),
        last_name: String(formData.get('last_name') ?? ''),
        phone: String(formData.get('phone') ?? ''),
      })
      if (!res.success) {
        setErrors(res.fieldErrors ?? {})
        return
      }
      setOpen(false)
      router.refresh()
    })
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
      >
        Editar perfil
      </button>
    )
  }

  return (
    <form action={onSubmit} className="mt-4 border border-white/15 bg-white/[0.03] p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="first_name">Nombre</Label>
          <div className="mt-2">
            <Input id="first_name" name="first_name" defaultValue={profile.first_name} error={errors.first_name?.[0]} />
          </div>
        </div>
        <div>
          <Label htmlFor="last_name">Apellidos</Label>
          <div className="mt-2">
            <Input id="last_name" name="last_name" defaultValue={profile.last_name} error={errors.last_name?.[0]} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <div className="mt-2">
            <Input id="phone" name="phone" defaultValue={profile.phone ?? ''} error={errors.phone?.[0]} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:opacity-50"
        >
          {pending ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
