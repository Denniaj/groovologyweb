'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteClass } from '@/lib/actions/admin'

export function DeleteClassButton({ id }: { id: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function onClick() {
    if (!confirm('¿Eliminar esta clase del horario?')) return
    startTransition(async () => {
      const res = await deleteClass(id)
      if (!res.success) alert(res.error)
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
      {pending ? '…' : 'Eliminar'}
    </button>
  )
}
