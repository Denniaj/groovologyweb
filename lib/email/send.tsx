import { sendEmail } from '@/lib/email/resend'
import {
  WelcomeEmail,
  ReceiptVerifiedEmail,
  ReceiptNeedsReviewEmail,
  PackageExpiringEmail,
  ChargeReminderEmail,
  ClassReminderEmail,
} from '@/lib/email/templates'

// Funciones tipadas por evento. Todas devuelven true/false y nunca lanzan
// (sendEmail atrapa los errores): un correo fallido no rompe el flujo.

export function sendWelcomeEmail(to: string, name: string) {
  return sendEmail(to, '¡Bienvenida a Groovology!', <WelcomeEmail name={name} />)
}

export function sendReceiptVerifiedEmail(to: string, name: string, amount: number, concept: string) {
  return sendEmail(to, 'Tu pago fue verificado', <ReceiptVerifiedEmail name={name} amount={amount} concept={concept} />)
}

export function sendReceiptNeedsReviewEmail(to: string, name: string, reason: string) {
  return sendEmail(to, 'Tu comprobante está en revisión', <ReceiptNeedsReviewEmail name={name} reason={reason} />)
}

export function sendPackageExpiringEmail(to: string, name: string, endDate: string) {
  return sendEmail(to, 'Tu paquete está por vencer', <PackageExpiringEmail name={name} endDate={endDate} />)
}

export function sendClassReminderEmail(to: string, name: string, className: string, time: string) {
  return sendEmail(to, 'Recordatorio: mañana tienes clase', <ClassReminderEmail name={name} className={className} time={time} />)
}

export function sendChargeReminderEmail(
  to: string,
  name: string,
  amount: number,
  concept: string,
  dueDate: string,
  overdue: boolean
) {
  return sendEmail(
    to,
    overdue ? 'Tienes un cobro vencido' : 'Recordatorio de cobro',
    <ChargeReminderEmail name={name} amount={amount} concept={concept} dueDate={dueDate} overdue={overdue} />
  )
}
