import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, getMyProfile, getMyEnrollments, getMyCharges, getMyEvents, getMyTrial } from '@/lib/account'
import { getClasses } from '@/lib/data'
import { ClassBadges } from '@/components/site/ClassBadges'
import { ReceiptUpload } from '@/components/account/ReceiptUpload'
import { LogoutButton, TrialClassPicker } from '@/components/account/AccountActions'
import { WEEKDAYS, formatTime } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Mi cuenta',
  robots: { index: false, follow: false },
}

const crc = (n: number) => '₡' + n.toLocaleString('es-CR')

const CHARGE_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pendiente', cls: 'border-amber-300/40 text-amber-200' },
  overdue: { label: 'Vencido', cls: 'border-red-400/40 text-red-300' },
  paid: { label: 'Pagado', cls: 'border-green-400/40 text-green-300' },
  cancelled: { label: 'Cancelado', cls: 'border-white/20 text-white/40' },
}

const ENROLLMENT_STATUS: Record<string, string> = {
  pending_payment: 'Pendiente de pago',
  active: 'Activa',
  expired: 'Vencida',
  cancelled: 'Cancelada',
}

export default async function MiCuentaPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [profile, enrollments, charges, events, trial] = await Promise.all([
    getMyProfile(user.id),
    getMyEnrollments(user.id),
    getMyCharges(user.id),
    getMyEvents(user.id),
    getMyTrial(user.id),
  ])

  const pendientes = charges.filter((c) => c.status === 'pending' || c.status === 'overdue')
  const totalPendiente = pendientes.reduce((s, c) => s + c.amount_crc, 0)
  const puedeProbar = profile?.is_new_student && !trial
  const trialClasses = puedeProbar ? await getClasses() : []

  return (
    <section className="mx-auto max-w-4xl px-5 py-12 lg:py-16">
      {/* CABECERA */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Mi cuenta</p>
          <h1 className="mt-3 font-display text-4xl uppercase leading-none tracking-tight">
            Hola, {profile?.first_name ?? ''}
          </h1>
        </div>
        <LogoutButton />
      </div>

      {/* RESUMEN */}
      <div className="mt-8 grid gap-px border border-white/10 sm:grid-cols-3">
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Por pagar</p>
          <p className="mt-1 font-display text-2xl">{crc(totalPendiente)}</p>
        </div>
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Clases activas</p>
          <p className="mt-1 font-display text-2xl">
            {enrollments.filter((e) => e.status === 'active').length}
          </p>
        </div>
        <div className="bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-widest text-white/40">Eventos</p>
          <p className="mt-1 font-display text-2xl">{events.length}</p>
        </div>
      </div>

      {/* CLASE DE PRUEBA */}
      {puedeProbar && (
        <div className="mt-10">
          <TrialClassPicker
            classes={trialClasses.map((c) => ({
              id: c.id,
              weekday: c.weekday,
              start_time: c.start_time,
              dance_styles: c.dance_styles ? { name: c.dance_styles.name } : null,
            }))}
          />
        </div>
      )}

      {trial && (
        <p className="mt-10 border border-white/15 bg-white/[0.03] px-5 py-4 text-sm text-white/60">
          Ya tomaste tu clase de prueba gratuita
          {trial.classes?.dance_styles?.name ? ` de ${trial.classes.dance_styles.name}` : ''}. ¡Esperamos verte seguido!
        </p>
      )}

      {/* MIS CLASES */}
      <h2 className="mt-12 font-display text-2xl uppercase tracking-wide">Mis clases</h2>
      {enrollments.length === 0 ? (
        <p className="mt-4 text-sm text-white/50">
          Todavía no tienes inscripciones.{' '}
          <Link href="/horarios" className="underline underline-offset-4">Mira los horarios</Link>.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {enrollments.map((e) => (
            <li key={e.id} className="border border-white/10 bg-white/[0.02] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-widest">
                  {e.packages?.name ?? 'Inscripción'}
                </span>
                <span className="border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60">
                  {ENROLLMENT_STATUS[e.status] ?? e.status}
                </span>
              </div>
              {e.minor_name && (
                <p className="mt-1 text-xs text-white/50">Alumno/a: {e.minor_name}</p>
              )}
              <ul className="mt-3 space-y-2">
                {e.enrollment_classes?.map((ec, i) => {
                  const c = ec.classes
                  if (!c) return null
                  return (
                    <li key={i} className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                      <span className="font-semibold">{c.dance_styles?.name}</span>
                      <span>{WEEKDAYS[c.weekday]} · {formatTime(c.start_time)}</span>
                      <ClassBadges isKids={c.is_kids} level={c.level} />
                      <span className="text-xs text-white/30">{c.room}</span>
                    </li>
                  )
                })}
              </ul>
              {e.end_date && (
                <p className="mt-3 text-xs text-white/40">Vigencia hasta {e.end_date}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* MIS COBROS */}
      <h2 className="mt-12 font-display text-2xl uppercase tracking-wide">Mis cobros</h2>
      {charges.length === 0 ? (
        <p className="mt-4 text-sm text-white/50">No tienes cobros por ahora.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {charges.map((c) => {
            const st = CHARGE_STATUS[c.status] ?? { label: c.status, cls: 'border-white/20 text-white/50' }
            const enRevision = c.payment_receipts?.some((r) => r.status === 'needs_review')
            const porPagar = c.status === 'pending' || c.status === 'overdue'
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold">{c.description ?? 'Cargo'}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {crc(c.amount_crc)}
                    {c.due_date ? ` · vence ${c.due_date}` : ''}
                  </p>
                  {enRevision && (
                    <p className="mt-1 text-xs text-amber-300">Comprobante en revisión</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${st.cls}`}>
                    {st.label}
                  </span>
                  {porPagar && <ReceiptUpload chargeId={c.id} />}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* MIS EVENTOS */}
      {events.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-2xl uppercase tracking-wide">Mis eventos</h2>
          <ul className="mt-4 space-y-3">
            {events.map((p) => (
              <li key={p.id} className="border border-white/10 bg-white/[0.02] p-5">
                <p className="text-sm font-semibold uppercase tracking-widest">{p.events?.name}</p>
                {p.events?.event_date && (
                  <p className="mt-1 text-xs text-white/40">{p.events.event_date}</p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
