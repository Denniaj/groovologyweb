'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadReceipt } from '@/lib/actions/receipts'

// Sube el comprobante de un cargo. El sistema lo lee y decide solo
// (aprobado o a revisión); aquí mostramos el resultado.
export function ReceiptUpload({ chargeId }: { chargeId: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onFile(file: File) {
    setMsg(null)
    startTransition(async () => {
      const res = await uploadReceipt({ charge_id: chargeId, file })
      if (!res.success) {
        setMsg({ ok: false, text: res.error })
        return
      }
      setMsg(
        res.data.status === 'auto_approved'
          ? { ok: true, text: '¡Pago verificado! Tu cargo quedó al día.' }
          : { ok: false, text: `En revisión: ${res.data.reason ?? 'lo revisará el equipo'}` }
      )
      router.refresh()
    })
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        className="border border-white px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-white hover:text-black disabled:opacity-50"
      >
        {pending ? 'Subiendo…' : 'Subir comprobante'}
      </button>
      {msg && (
        <p className={`mt-2 text-xs ${msg.ok ? 'text-green-300' : 'text-amber-300'}`}>{msg.text}</p>
      )}
    </div>
  )
}
