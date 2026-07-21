import type { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'
import { Prose, DraftNotice } from '@/components/site/Prose'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Groovology trata los datos personales de sus estudiantes (Ley 8968, Costa Rica).',
}

export default function PrivacidadPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Política de privacidad" />
      <Prose>
        <DraftNotice />

        <p>
          En Groovology respetamos y protegemos tus datos personales conforme a la
          <strong> Ley N.º 8968 de Protección de la Persona frente al Tratamiento de sus Datos Personales</strong> de
          Costa Rica y su reglamento (PRODHAB).
        </p>

        <h2>Responsable</h2>
        <p>Groovology — Cartago, El Molino, Costa Rica.</p>

        <h2>Qué datos recolectamos</h2>
        <ul>
          <li>Nombre y apellidos</li>
          <li>Correo electrónico y número de teléfono</li>
          <li>Fecha de nacimiento</li>
          <li>Número de cédula</li>
          <li>Nombre del menor, cuando se inscribe a un niño o niña</li>
          <li>Comprobantes de pago de SINPE Móvil (imagen y datos de la transacción)</li>
        </ul>

        <h2>Para qué los usamos</h2>
        <ul>
          <li>Gestionar tu inscripción, clases y estado de cuenta</li>
          <li>Verificar los pagos realizados por SINPE Móvil</li>
          <li>Enviarte comunicaciones sobre tus clases, cobros y eventos</li>
          <li>Cumplir requisitos de inscripción en competencias, cuando aplique</li>
        </ul>
        <p>
          La cédula y la fecha de nacimiento se solicitan para identificarte de forma inequívoca y
          para trámites de inscripción en eventos o competencias. No los usamos para ningún otro fin
          ni los compartimos con terceros con fines comerciales.
        </p>

        <h2>Cómo los protegemos</h2>
        <p>
          Tus datos se almacenan de forma cifrada y con controles de acceso a nivel de base de datos:
          cada estudiante solo puede ver su propia información. Los comprobantes de pago se guardan en
          un repositorio privado, accesible únicamente mediante enlaces temporales.
        </p>

        <h2>Proveedores que usamos</h2>
        <ul>
          <li>Supabase — base de datos y almacenamiento</li>
          <li>Vercel — alojamiento del sitio</li>
          <li>Resend — envío de correos transaccionales</li>
          <li>Google (Gemini) — lectura automática de los comprobantes de pago</li>
        </ul>

        <h2>Conservación</h2>
        <p>
          Conservamos tus datos mientras tengas una cuenta activa y por el plazo que exija la
          normativa contable y tributaria aplicable. Luego se eliminan o anonimizan.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes solicitar en cualquier momento el <strong>acceso, rectificación, actualización o
          eliminación</strong> de tus datos, así como revocar tu consentimiento, escribiéndonos por
          nuestros canales de contacto. También puedes acudir a la Agencia de Protección de Datos de
          los Habitantes (PRODHAB).
        </p>

        <h2>Cambios</h2>
        <p>
          Si actualizamos esta política, publicaremos la nueva versión en esta misma página.
        </p>
      </Prose>
    </>
  )
}
