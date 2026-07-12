import { createAdminClient } from '@/lib/supabase/admin'
import {
  sendPackageExpiringEmail,
  sendChargeReminderEmail,
  sendClassReminderEmail,
} from '@/lib/email/send'

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

// Fecha en zona horaria de Costa Rica como 'YYYY-MM-DD'. en-CA formatea así.
function crDate(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000)
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' })
}

// Recordatorios se envían exactamente 3 días antes → cada uno se manda una
// sola vez, sin necesidad de un flag "ya recordado" y sin spam diario.
const REMINDER_LEAD_DAYS = 3

// Marca como 'expired' las inscripciones activas cuya vigencia ya pasó.
// Solo informativo/estado: no expulsa de eventos ni cancela cargos.
async function expirePackages(): Promise<number> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('enrollments')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('end_date', crDate())
    .select('id')
  return data?.length ?? 0
}

// Marca 'overdue' los cargos pendientes cuya fecha límite ya pasó.
// 'overdue' es SOLO informativo (ver esquema Fase 1).
async function markOverdueCharges(): Promise<number> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('charges')
    .update({ status: 'overdue' })
    .eq('status', 'pending')
    .lt('due_date', crDate())
    .select('id')
  return data?.length ?? 0
}

// Avisa a los alumnos cuyo paquete vence en exactamente 3 días.
async function remindExpiringPackages(): Promise<number> {
  const admin = createAdminClient()
  const target = crDate(REMINDER_LEAD_DAYS)
  const { data } = await admin
    .from('enrollments')
    .select('end_date, profiles(email, first_name)')
    .eq('status', 'active')
    .eq('end_date', target)

  let sent = 0
  for (const row of data ?? []) {
    const profile = row.profiles
    if (profile?.email && row.end_date) {
      await sendPackageExpiringEmail(profile.email, profile.first_name, row.end_date)
      sent++
    }
  }
  return sent
}

// Recuerda cargos pendientes cuya fecha límite es en exactamente 3 días.
async function remindUpcomingCharges(): Promise<number> {
  const admin = createAdminClient()
  const target = crDate(REMINDER_LEAD_DAYS)
  const { data } = await admin
    .from('charges')
    .select('amount_crc, description, due_date, profiles(email, first_name)')
    .eq('status', 'pending')
    .eq('due_date', target)

  let sent = 0
  for (const row of data ?? []) {
    const profile = row.profiles
    if (profile?.email && row.due_date) {
      await sendChargeReminderEmail(
        profile.email,
        profile.first_name,
        row.amount_crc,
        row.description ?? 'Cargo',
        row.due_date,
        false
      )
      sent++
    }
  }
  return sent
}

// Recuerda a los alumnos con inscripción activa las clases que tienen mañana.
async function remindTomorrowClasses(): Promise<number> {
  const admin = createAdminClient()
  const tomorrow = new Date(Date.now() + 86_400_000)
  const short = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Costa_Rica',
    weekday: 'short',
  }).format(tomorrow)
  const weekday = WEEKDAY[short]

  const { data } = await admin
    .from('enrollment_classes')
    .select('classes!inner(start_time, dance_styles(name)), enrollments!inner(status, profiles(email, first_name))')
    .eq('classes.weekday', weekday)
    .eq('classes.is_active', true)
    .eq('enrollments.status', 'active')

  let sent = 0
  for (const row of data ?? []) {
    const profile = row.enrollments?.profiles
    const className = row.classes?.dance_styles?.name ?? 'tu clase'
    const time = row.classes?.start_time?.slice(0, 5) ?? ''
    if (profile?.email) {
      await sendClassReminderEmail(profile.email, profile.first_name, className, time)
      sent++
    }
  }
  return sent
}

// Orquesta todas las tareas diarias. El cron solo avisa por correo; nunca
// retira a un alumno de un evento ni cancela nada (eso lo decide el admin).
export async function runDailyTasks() {
  const packagesExpired = await expirePackages()
  const chargesMarkedOverdue = await markOverdueCharges()
  const packageReminders = await remindExpiringPackages()
  const chargeReminders = await remindUpcomingCharges()
  const classReminders = await remindTomorrowClasses()
  return { packagesExpired, chargesMarkedOverdue, packageReminders, chargeReminders, classReminders }
}
