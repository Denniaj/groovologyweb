import type { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'
import { Prose, DraftNotice } from '@/components/site/Prose'

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso del sitio y de inscripción a las clases de Groovology.',
}

export default function TerminosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Términos y condiciones" />
      <Prose>
        <DraftNotice />

        <h2>Aceptación</h2>
        <p>
          Al crear una cuenta o inscribirte en una clase de Groovology, aceptas estas condiciones.
        </p>

        <h2>Cuenta</h2>
        <ul>
          <li>Los datos que registres deben ser reales y estar actualizados.</li>
          <li>Eres responsable de la seguridad de tu contraseña.</li>
          <li>
            Si inscribes a un menor de edad, la cuenta pertenece a la persona adulta responsable, quien
            gestiona los pagos.
          </li>
        </ul>

        <h2>Inscripciones y clases</h2>
        <ul>
          <li>La inscripción queda confirmada cuando se verifica el pago correspondiente.</li>
          <li>Las clases tienen una duración de 1 hora.</li>
          <li>
            Groovology puede ajustar horarios, instructores o salón por motivos operativos; los cambios
            se comunican con la mayor anticipación posible.
          </li>
          <li>La clase de prueba gratuita está limitada a una por persona.</li>
        </ul>

        <h2>Pagos</h2>
        <ul>
          <li>Los pagos se realizan por SINPE Móvil al número indicado por la academia.</li>
          <li>
            El comprobante se sube desde tu cuenta y se verifica automáticamente comparando el monto y
            la referencia. Un mismo comprobante no puede usarse para dos cobros distintos.
          </li>
          <li>
            Si el comprobante no puede verificarse automáticamente, queda en revisión manual por parte
            del equipo.
          </li>
        </ul>

        <h2>Convivencia</h2>
        <p>
          Groovology es un espacio seguro. No se tolera ningún tipo de discriminación, acoso o
          conducta que afecte a la comunidad. El incumplimiento puede implicar la salida de la academia.
        </p>

        <h2>Imagen</h2>
        <p>
          En clases, shows y eventos podemos tomar fotografías o video con fines de difusión. Si no
          deseas aparecer, avísanos y respetaremos tu decisión.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          La marca, el logo, las coreografías y los contenidos de este sitio pertenecen a Groovology.
        </p>
      </Prose>
    </>
  )
}
