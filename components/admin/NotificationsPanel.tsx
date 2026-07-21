'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markNotificationRead, markAllNotificationsRead } from '@/lib/actions/admin'

type Notification = {
  id: string
  type: string
  message: string | null
  is_read: boolean
  created_at: string
}

const TYPE_LABEL: Record<string, string> = {
  trial_requested: 'Clase de prueba',
  receipt_uploaded: 'Comprobante',
  event_joined: 'Evento',
  other: 'Aviso',
}

function timeAgo(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function NotificationsPanel({ notifications }: { notifications: Notification[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const hasUnread = notifications.some((n) => !n.is_read)

  function readOne(id: string) {
    startTransition(async () => {
      await markNotificationRead(id)
      router.refresh()
    })
  }
  function readAll() {
    startTransition(async () => {
      await markAllNotificationsRead()
      router.refresh()
    })
  }

  return (
    <div className="border border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest">Notificaciones</h2>
        {hasUnread && (
          <button
            type="button"
            onClick={readAll}
            disabled={pending}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white disabled:opacity-50"
          >
            Marcar todas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="px-5 py-8 text-sm text-white/40">No hay notificaciones.</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {notifications.map((n) => (
            <li key={n.id} className={`flex items-start justify-between gap-3 px-5 py-4 ${n.is_read ? 'opacity-50' : ''}`}>
              <div>
                <div className="flex items-center gap-2">
                  {!n.is_read && <span className="h-2 w-2 rounded-full bg-white" />}
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    {TYPE_LABEL[n.type] ?? n.type}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/80">{n.message ?? '—'}</p>
                <p className="mt-1 text-xs text-white/30">{timeAgo(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <button
                  type="button"
                  onClick={() => readOne(n.id)}
                  disabled={pending}
                  className="shrink-0 text-xs uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-50"
                >
                  Leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
