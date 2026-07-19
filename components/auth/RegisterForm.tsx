'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/lib/actions/auth'
import { Label, Input, Select, SubmitButton, FormAlert, FieldError } from '@/components/ui/Field'
import { ClassBadges } from '@/components/site/ClassBadges'
import { WEEKDAYS, formatTime } from '@/lib/format'

export type PackageOption = { id: string; name: string; price_crc: number; duration_days: number }
export type ClassOption = {
  id: string
  weekday: number
  start_time: string
  level: string
  is_kids: boolean
  dance_styles: { name: string } | null
}
export type EventOption = { id: string; name: string }

const crc = (n: number) => '₡' + n.toLocaleString('es-CR')

export function RegisterForm({
  packages,
  classes,
  events,
}: {
  packages: PackageOption[]
  classes: ClassOption[]
  events: EventOption[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [done, setDone] = useState<null | { needsEmailConfirmation: boolean }>(null)

  const [isNew, setIsNew] = useState(true)
  const [packageId, setPackageId] = useState('')
  const [classIds, setClassIds] = useState<string[]>([])
  const [eventIds, setEventIds] = useState<string[]>([])

  const kidsSelected = classes.some((c) => classIds.includes(c.id) && c.is_kids)

  function toggle(list: string[], id: string, set: (v: string[]) => void) {
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  }

  function onSubmit(formData: FormData) {
    setError(undefined)
    setFieldErrors({})
    startTransition(async () => {
      const res = await register({
        first_name: String(formData.get('first_name') ?? ''),
        last_name: String(formData.get('last_name') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        birth_date: String(formData.get('birth_date') ?? ''),
        national_id: String(formData.get('national_id') ?? ''),
        is_new_student: isNew,
        package_id: isNew ? undefined : packageId || undefined,
        class_ids: isNew ? [] : classIds,
        minor_name: kidsSelected ? String(formData.get('minor_name') ?? '') || undefined : undefined,
        event_ids: eventIds,
      })

      if (!res.success) {
        setError(res.error)
        setFieldErrors(res.fieldErrors ?? {})
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (res.data.needsEmailConfirmation) {
        setDone(res.data)
      } else {
        router.push('/mi-cuenta')
      }
    })
  }

  if (done) {
    return (
      <div className="border border-white/15 bg-white/[0.03] p-8">
        <h2 className="font-display text-2xl uppercase tracking-wide">¡Bienvenida a Groovology!</h2>
        <p className="mt-3 text-sm text-white/70">
          Tu cuenta quedó creada. Te enviamos un correo para confirmarla — revísalo (y la carpeta de
          spam) para poder ingresar.
        </p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="space-y-10">
      <FormAlert>{error}</FormAlert>

      {/* DATOS PERSONALES */}
      <fieldset className="space-y-5">
        <legend className="font-display text-xl uppercase tracking-wide">Tus datos</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="first_name">Nombre</Label>
            <div className="mt-2">
              <Input id="first_name" name="first_name" required error={fieldErrors.first_name?.[0]} />
            </div>
          </div>
          <div>
            <Label htmlFor="last_name">Apellidos</Label>
            <div className="mt-2">
              <Input id="last_name" name="last_name" required error={fieldErrors.last_name?.[0]} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Correo</Label>
            <div className="mt-2">
              <Input id="email" name="email" type="email" autoComplete="email" required error={fieldErrors.email?.[0]} />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Mínimo 8, con letra y número"
                error={fieldErrors.password?.[0]}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <div className="mt-2">
              <Input id="phone" name="phone" required placeholder="8888 8888" error={fieldErrors.phone?.[0]} />
            </div>
          </div>
          <div>
            <Label htmlFor="birth_date">Fecha de nacimiento</Label>
            <div className="mt-2">
              <Input id="birth_date" name="birth_date" type="date" required error={fieldErrors.birth_date?.[0]} />
            </div>
          </div>
          <div>
            <Label htmlFor="national_id">Cédula</Label>
            <div className="mt-2">
              <Input id="national_id" name="national_id" required placeholder="1-2345-6789" error={fieldErrors.national_id?.[0]} />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ¿ES NUEVA? */}
      <fieldset className="space-y-4">
        <legend className="font-display text-xl uppercase tracking-wide">¿Ya bailabas con nosotros?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setIsNew(true)}
            className={`border px-5 py-4 text-left transition-colors ${isNew ? 'border-white bg-white text-black' : 'border-white/25 text-white/70 hover:border-white'}`}
          >
            <span className="block text-sm font-semibold uppercase tracking-widest">Soy nueva</span>
            <span className={`mt-1 block text-xs ${isNew ? 'text-black/70' : 'text-white/50'}`}>
              Te ofrecemos tu primera clase de prueba gratis.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsNew(false)}
            className={`border px-5 py-4 text-left transition-colors ${!isNew ? 'border-white bg-white text-black' : 'border-white/25 text-white/70 hover:border-white'}`}
          >
            <span className="block text-sm font-semibold uppercase tracking-widest">Ya tomaba clases</span>
            <span className={`mt-1 block text-xs ${!isNew ? 'text-black/70' : 'text-white/50'}`}>
              Elige tu paquete y tus clases ahora.
            </span>
          </button>
        </div>
      </fieldset>

      {/* PAQUETE Y CLASES (solo si no es nueva) */}
      {!isNew && (
        <fieldset className="space-y-6">
          <legend className="font-display text-xl uppercase tracking-wide">Tu paquete y clases</legend>

          <div>
            <Label htmlFor="package_id">Paquete</Label>
            <div className="mt-2">
              <Select
                id="package_id"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                error={fieldErrors.package_id?.[0]}
              >
                <option value="">Selecciona un paquete</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {crc(p.price_crc)} / {p.duration_days} días
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Clases</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {classes.map((c) => {
                const checked = classIds.includes(c.id)
                return (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 transition-colors ${checked ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/50'}`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(classIds, c.id, setClassIds)}
                        className="h-4 w-4 accent-white"
                      />
                      <span>
                        <span className="block text-sm font-semibold uppercase tracking-wide">
                          {c.dance_styles?.name}
                        </span>
                        <span className="block text-xs text-white/50">
                          {WEEKDAYS[c.weekday]} · {formatTime(c.start_time)}
                        </span>
                      </span>
                    </span>
                    <ClassBadges isKids={c.is_kids} level={c.level} />
                  </label>
                )
              })}
            </div>
            <FieldError>{fieldErrors.class_ids?.[0]}</FieldError>
          </div>

          {kidsSelected && (
            <div>
              <Label htmlFor="minor_name">Nombre del niño o niña</Label>
              <p className="mt-1 text-xs text-white/50">
                Elegiste una clase de peques. La cuenta queda a tu nombre; aquí va el nombre de quien asiste.
              </p>
              <div className="mt-2">
                <Input id="minor_name" name="minor_name" required error={fieldErrors.minor_name?.[0]} />
              </div>
            </div>
          )}
        </fieldset>
      )}

      {/* EVENTOS ABIERTOS */}
      {events.length > 0 && (
        <fieldset className="space-y-4">
          <legend className="font-display text-xl uppercase tracking-wide">Eventos abiertos</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((e) => (
              <label
                key={e.id}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-3 transition-colors ${eventIds.includes(e.id) ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/50'}`}
              >
                <input
                  type="checkbox"
                  checked={eventIds.includes(e.id)}
                  onChange={() => toggle(eventIds, e.id, setEventIds)}
                  className="h-4 w-4 accent-white"
                />
                <span className="text-sm">{e.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="space-y-4">
        <SubmitButton pending={pending}>Crear mi cuenta</SubmitButton>
        <p className="text-xs text-white/40">
          Al crear tu cuenta aceptas nuestros términos y la política de privacidad.
        </p>
      </div>
    </form>
  )
}
