'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '@/lib/actions/auth'
import { Label, Input, SubmitButton, FormAlert } from '@/components/ui/Field'

export function NewPasswordForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  function onSubmit(formData: FormData) {
    setError(undefined)
    setFieldErrors({})
    startTransition(async () => {
      const res = await updatePassword({ password: String(formData.get('password') ?? '') })
      if (!res.success) {
        setError(res.error)
        setFieldErrors(res.fieldErrors ?? {})
        return
      }
      router.push('/mi-cuenta')
      router.refresh()
    })
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <FormAlert>{error}</FormAlert>
      <div>
        <Label htmlFor="password">Nueva contraseña</Label>
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
      <SubmitButton pending={pending}>Guardar contraseña</SubmitButton>
    </form>
  )
}
