import type { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'
import { Prose, DraftNotice } from '@/components/site/Prose'

export const metadata: Metadata = {
  title: 'Política de cancelación',
  description: 'Condiciones de cancelación y reembolso de paquetes y eventos en Groovology.',
}

export default function CancelacionPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Política de cancelación" />
      <Prose>
        <DraftNotice />

        <h2>Mensualidades</h2>
        <p>
          Los paquetes tienen una vigencia determinada desde su activación. Puedes cancelar la
          renovación en cualquier momento desde tu cuenta; la cancelación aplica para el siguiente
          periodo y no interrumpe el paquete vigente.
        </p>

        <h2>Reembolsos</h2>
        <p>
          Las condiciones específicas de reembolso y de pausa de mensualidad las define la academia
          según cada caso. Si tuviste un imprevisto, escríbenos y buscamos una solución.
        </p>

        <h2>Eventos y competencias</h2>
        <p>
          Los costos de eventos (vestuario, montaje e inscripción) corresponden a gastos que la
          academia asume por adelantado con proveedores y organizadores. Por eso, una vez realizado el
          pago de un concepto, su devolución queda sujeta a si ese gasto ya fue ejecutado.
        </p>

        <h2>Cambios de horario</h2>
        <p>
          Si Groovology cancela o modifica una clase de forma permanente, se te ofrecerá una
          alternativa equivalente dentro de la programación.
        </p>

        <h2>Cómo solicitarlo</h2>
        <p>
          Cualquier solicitud de cancelación o reembolso se gestiona escribiéndonos por nuestros
          canales de contacto, indicando tu nombre y el concepto correspondiente.
        </p>
      </Prose>
    </>
  )
}
