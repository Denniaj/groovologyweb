// Campos de formulario con la estética del sitio (oscuro, alto contraste).
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

const base =
  'w-full border border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white focus:outline-none disabled:opacity-50'

export function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-widest text-white/60">
      {children}
    </label>
  )
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs text-red-400">{children}</p>
}

export function Input({ error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <>
      <input {...props} className={`${base} ${error ? 'border-red-400/60' : ''} ${props.className ?? ''}`} />
      <FieldError>{error}</FieldError>
    </>
  )
}

export function Select({ error, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <>
      <select
        {...props}
        className={`${base} [&>option]:bg-neutral-900 [&>option]:text-white ${error ? 'border-red-400/60' : ''} ${props.className ?? ''}`}
      >
        {children}
      </select>
      <FieldError>{error}</FieldError>
    </>
  )
}

export function SubmitButton({ pending, children }: { pending?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Enviando…' : children}
    </button>
  )
}

export function FormAlert({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return (
    <p className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">{children}</p>
  )
}
