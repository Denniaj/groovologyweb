'use client'

import { useState, useTransition } from 'react'
import { requestPasswordReset } from '@/lib/actions/auth'
import { Label, Input, SubmitButton, FormAlert } from '@/components/ui/Field'

export function ForgotForm() {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)

  function onSubmit(formData: FormData) {
    setError(undefined)
    startTransition(async () => {
      const res = await requestPasswordReset({ email: String(formData.get('email') ?? '') })
      if (!res.success) {
        setError(res.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="border border-white/15 bg-white/[0.03] p-6">
        <p className="text-sm text-white/80">
          Si ese correo tiene una cuenta, te enviamos un enlace para restablecer tu contraseña.
          Revisa tu bandeja de entrada (y la carpeta de spam).
        </p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="space-y-5">
      <FormAlert>{error}</FormAlert>
      <div>
        <Label htmlFor="email">Correo</Label>
        <div className="mt-2">
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="tu@correo.com" />
        </div>
      </div>
      <SubmitButton pending={pending}>Enviar enlace</SubmitButton>
    </form>
  )
}
