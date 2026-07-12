import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from '@react-email/components'
import type { ReactNode } from 'react'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Colones con separador de miles.
function crc(n: number) {
  return '₡' + n.toLocaleString('es-CR')
}

// ---------------------------------------------------------------------
// Layout compartido — estética blanco y negro urbana de Groovology.
// ---------------------------------------------------------------------
function Layout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#f4f4f4', fontFamily: 'Arial, Helvetica, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff' }}>
          <Section style={{ backgroundColor: '#000000', padding: '24px 32px' }}>
            <Heading as="h1" style={{ color: '#ffffff', margin: 0, fontSize: '22px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Groovology
            </Heading>
          </Section>
          <Section style={{ padding: '32px' }}>{children}</Section>
          <Hr style={{ borderColor: '#e5e5e5', margin: 0 }} />
          <Section style={{ padding: '20px 32px' }}>
            <Text style={{ color: '#888888', fontSize: '12px', margin: 0 }}>
              Groovology — Academia de baile. Este es un correo automático, no lo respondas.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const h2 = { fontSize: '18px', color: '#000000', margin: '0 0 12px' }
const p = { fontSize: '15px', color: '#333333', lineHeight: '1.5', margin: '0 0 16px' }
const btn = {
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '4px',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'inline-block',
}

// ---------------------------------------------------------------------
// Plantillas
// ---------------------------------------------------------------------
export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Layout preview="Bienvenida a Groovology">
      <Heading as="h2" style={h2}>¡Hola, {name}! 👋</Heading>
      <Text style={p}>
        Tu cuenta en Groovology quedó lista. Desde tu perfil puedes ver tus clases,
        tus cobros y subir tus comprobantes de pago.
      </Text>
      <Button href={`${SITE_URL}/mi-cuenta`} style={btn}>Ir a mi cuenta</Button>
    </Layout>
  )
}

export function ReceiptVerifiedEmail({ name, amount, concept }: { name: string; amount: number; concept: string }) {
  return (
    <Layout preview="Tu pago fue verificado">
      <Heading as="h2" style={h2}>Pago verificado ✅</Heading>
      <Text style={p}>
        Hola {name}, recibimos y verificamos tu comprobante por <strong>{crc(amount)}</strong>{' '}
        ({concept}). Tu cargo quedó marcado como pagado.
      </Text>
      <Button href={`${SITE_URL}/mi-cuenta`} style={btn}>Ver mis cobros</Button>
    </Layout>
  )
}

export function ReceiptNeedsReviewEmail({ name, reason }: { name: string; reason: string }) {
  return (
    <Layout preview="Tu comprobante está en revisión">
      <Heading as="h2" style={h2}>Comprobante en revisión</Heading>
      <Text style={p}>
        Hola {name}, recibimos tu comprobante pero necesita una revisión manual:{' '}
        <strong>{reason}</strong>
      </Text>
      <Text style={p}>Nuestro equipo lo revisará pronto. No necesitas volver a subirlo.</Text>
    </Layout>
  )
}

export function PackageExpiringEmail({ name, endDate }: { name: string; endDate: string }) {
  return (
    <Layout preview="Tu paquete está por vencer">
      <Heading as="h2" style={h2}>Tu paquete vence pronto</Heading>
      <Text style={p}>
        Hola {name}, tu paquete de mensualidad vence el <strong>{endDate}</strong>.
        Renuévalo para no perder tu cupo en las clases.
      </Text>
      <Button href={`${SITE_URL}/mi-cuenta`} style={btn}>Renovar</Button>
    </Layout>
  )
}

export function ClassReminderEmail({ name, className, time }: { name: string; className: string; time: string }) {
  return (
    <Layout preview="Recordatorio de tu clase de mañana">
      <Heading as="h2" style={h2}>¡Mañana tienes clase! 💃</Heading>
      <Text style={p}>
        Hola {name}, te recordamos tu clase de <strong>{className}</strong> mañana
        a las <strong>{time}</strong>. ¡Te esperamos!
      </Text>
    </Layout>
  )
}

export function ChargeReminderEmail({
  name,
  amount,
  concept,
  dueDate,
  overdue,
}: { name: string; amount: number; concept: string; dueDate: string; overdue: boolean }) {
  return (
    <Layout preview={overdue ? 'Tienes un cobro vencido' : 'Recordatorio de cobro'}>
      <Heading as="h2" style={h2}>{overdue ? 'Cobro vencido' : 'Recordatorio de cobro'}</Heading>
      <Text style={p}>
        Hola {name}, tienes un cobro de <strong>{crc(amount)}</strong> ({concept}){' '}
        {overdue ? <>que venció el <strong>{dueDate}</strong>.</> : <>con fecha límite <strong>{dueDate}</strong>.</>}
      </Text>
      <Button href={`${SITE_URL}/mi-cuenta`} style={btn}>Pagar ahora</Button>
    </Layout>
  )
}
