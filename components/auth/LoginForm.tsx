'use client'

import { useState, useTransition } from 'react'
import { login } from '@/lib/actions/auth'
import { Label, Input, SubmitButton, FormAlert } from '@/components/ui/Field'

export function LoginForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function onSubmit(formData: FormData) {
    setError(undefined)
    setFieldErrors({})
    startTransition(async () => {
      const res = await login({
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      })
      // Si sale bien, la acción redirige a /mi-cuenta y no volvemos aquí.
      if (res && !res.success) {
        setError(res.error)
        setFieldErrors(res.fieldErrors ?? {})
      }
    })
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <FormAlert>{error}</FormAlert>

      <div>
        <Label htmlFor="email">Correo</Label>
        <div className="mt-2">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@correo.com"
            error={fieldErrors.email?.[0]}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Contraseña</Label>
        <div className="mt-2">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            error={fieldErrors.password?.[0]}
          />
        </div>
      </div>

      <SubmitButton pending={pending}>Entrar</SubmitButton>
    </form>
  )
}
