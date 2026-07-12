import { Resend } from 'resend'
import { render } from '@react-email/components'
import type { ReactElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY!)

// Mientras el dominio no esté verificado en Resend (Fase 8), se puede usar
// el remitente de pruebas onboarding@resend.dev.
const FROM = process.env.EMAIL_FROM || 'Groovology <onboarding@resend.dev>'

// Envía un correo renderizando un componente de React Email a HTML + texto.
// Nunca lanza: devuelve true/false. El envío no debe tumbar la acción que lo llama.
export async function sendEmail(
  to: string,
  subject: string,
  element: ReactElement
): Promise<boolean> {
  try {
    const html = await render(element)
    const text = await render(element, { plainText: true })
    const { error } = await resend.emails.send({ from: FROM, to, subject, html, text })
    if (error) {
      console.error('Resend error:', error)
      return false
    }
    return true
  } catch (e) {
    console.error('sendEmail falló:', (e as Error).message)
    return false
  }
}
