'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClass, updateClass } from '@/lib/actions/admin'
import { Label, Input, Select, SubmitButton, FormAlert } from '@/components/ui/Field'

type Level = 'principiante' | 'intermedio' | 'avanzado' | 'todos'
type StyleOpt = { id: string; name: string }
type Initial = {
  style_id: string
  level: Level
  weekday: number
  start_time: string
  duration_minutes: number
  room: string
  is_kids: boolean
}

const DAYS = [
  { v: 1, label: 'Lunes' },
  { v: 2, label: 'Martes' },
  { v: 3, label: 'Miércoles' },
  { v: 4, label: 'Jueves' },
  { v: 5, label: 'Viernes' },
  { v: 6, label: 'Sábado' },
  { v: 0, label: 'Domingo' },
]

export function ClassForm({
  styles,
  initial,
  classId,
}: {
  styles: StyleOpt[]
  initial?: Initial
  classId?: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const [fe, setFe] = useState<Record<string, string[]>>({})
  const [isKids, setIsKids] = useState(initial?.is_kids ?? false)

  function onSubmit(formData: FormData) {
    setError(undefined)
    setFe({})
    const input = {
      style_id: String(formData.get('style_id') ?? ''),
      level: String(formData.get('level') ?? 'todos') as Initial['level'],
      weekday: Number(formData.get('weekday') ?? 1),
      start_time: String(formData.get('start_time') ?? ''),
      duration_minutes: Number(formData.get('duration_minutes') ?? 60),
      room: String(formData.get('room') ?? 'Salón 1'),
      is_kids: isKids,
    }
    startTransition(async () => {
      const res = classId ? await updateClass(classId, input) : await createClass(input)
      if (!res.success) {
        setError(res.error)
        setFe(res.fieldErrors ?? {})
        return
      }
      router.push('/admin/clases')
      router.refresh()
    })
  }

  return (
    <form action={onSubmit} className="max-w-lg space-y-5">
      <FormAlert>{error}</FormAlert>

      <div>
        <Label htmlFor="style_id">Estilo</Label>
        <div className="mt-2">
          <Select id="style_id" name="style_id" defaultValue={initial?.style_id ?? ''} error={fe.style_id?.[0]}>
            <option value="">Selecciona un estilo</option>
            {styles.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="weekday">Día</Label>
          <div className="mt-2">
            <Select id="weekday" name="weekday" defaultValue={String(initial?.weekday ?? 1)}>
              {DAYS.map((d) => (
                <option key={d.v} value={d.v}>{d.label}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="start_time">Hora</Label>
          <div className="mt-2">
            <Input id="start_time" name="start_time" type="time" defaultValue={initial?.start_time.slice(0, 5) ?? '18:00'} error={fe.start_time?.[0]} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="level">Nivel</Label>
          <div className="mt-2">
            <Select id="level" name="level" defaultValue={initial?.level ?? 'todos'}>
              <option value="todos">Todos</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="room">Salón</Label>
          <div className="mt-2">
            <Select id="room" name="room" defaultValue={initial?.room ?? 'Salón 1'}>
              <option value="Salón 1">Salón 1</option>
              <option value="Salón 2">Salón 2</option>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="duration_minutes">Duración</Label>
          <div className="mt-2">
            <Select id="duration_minutes" name="duration_minutes" defaultValue={String(initial?.duration_minutes ?? 60)}>
              <option value="60">1 hora</option>
              <option value="90">1 h 30 min</option>
            </Select>
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 border border-white/20 px-4 py-3">
        <input type="checkbox" checked={isKids} onChange={(e) => setIsKids(e.target.checked)} className="h-4 w-4 accent-white" />
        <span className="text-sm">Clase de niños (badge KIDS · peques)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <SubmitButton pending={pending}>{classId ? 'Guardar cambios' : 'Crear clase'}</SubmitButton>
        <button
          type="button"
          onClick={() => router.push('/admin/clases')}
          className="px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
