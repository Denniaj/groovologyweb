# Groovology — Academia de baile

Sitio web de Groovology: landing pública, inscripción a clases y paquetes, portal
del alumno y panel de administración para el equipo de la academia.

Infraestructura basada en el proyecto `Base` (sitio de citas de una psicóloga),
adaptando el mismo stack y modelo de seguridad al dominio de una academia de baile:
en vez de citas 1-a-1, clases con horario recurrente, instructores y paquetes;
en vez de pago con pasarela, comprobantes de **SINPE Móvil** que el alumno sube
y el sistema **verifica automáticamente** (sin que un admin tenga que aprobar
cada uno a mano en el caso normal — ver modelo de seguridad más abajo). Cada
alumno tiene su propio perfil con sus clases, su **estado de cuenta** (cobros
pendientes) y sus **eventos/competencias**, ya que participar en una
competencia genera cargos propios (vestuario, montaje, inscripción) además de
la mensualidad.

Ver el plan de trabajo completo en [`ROADMAP.md`](./ROADMAP.md) y lo que falta
por definir/aportar (cuentas, contenido, decisiones) en [`NECESITAMOS.md`](./NECESITAMOS.md).

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) + TypeScript | Framework principal |
| **Supabase** (PostgreSQL + Auth + RLS + Storage) | Base de datos, autenticación y almacenamiento de comprobantes |
| **Tailwind CSS + shadcn/ui** | Estilos y componentes |
| **Resend + React Email** | Correos transaccionales |
| **Vercel** | Hosting + Cron jobs |
| **react-hook-form + Zod** | Formularios con validación (front + back) |
| **date-fns-tz** | Fechas en `America/Costa_Rica` |
| **Gemini API (Google, visión)** | Extrae monto, referencia y fecha del comprobante SINPE; si coincide con lo esperado y la referencia no se reutilizó, el cargo se aprueba automáticamente. Casos dudosos (monto no coincide, referencia repetida, imagen ilegible) quedan en revisión manual — es la excepción, no la regla |

### Por qué este stack (heredado de Base)

- **Next.js + Vercel**: mismo framework y hosting que Base; despliegue simple,
  cron nativo para recordatorios/expiración de paquetes.
- **Supabase**: Postgres real con **Row Level Security** — un alumno solo puede
  ver sus propias inscripciones y comprobantes aunque hubiera un bug en la app.
  Storage privado con URLs firmadas para las imágenes de comprobantes.
- **Resend**: confirmaciones de inscripción, aviso de comprobante recibido/verificado/rechazado,
  recordatorio de clase, aviso de vencimiento de paquete.
- **shadcn/ui + Tailwind**: sistema de componentes propio, sin dependencia de un
  theme de terceros; fácil de adaptar a la identidad visual de Groovology —
  blanco y negro de alto contraste, estética urbana/streetwear, logo tipo
  grafiti/stencil (muy distinta a la paleta cálida de `Base`).

## Estructura de carpetas (propuesta)

```
groovologyweb/
├─ supabase/migrations/        Esquema, funciones/RPCs, RLS, seed
├─ lib/
│  ├─ supabase/                client.ts (browser) / server.ts (RSC) / admin.ts (service-role, solo servidor)
│  ├─ receipts/                Análisis de comprobantes SINPE (extracción + validaciones)
│  ├─ email/                   Envío con Resend + plantillas React Email
│  ├─ rate-limit.ts
│  ├─ validations.ts           Esquemas Zod
│  └─ types.ts                 Tipos del dominio
├─ app/
│  ├─ (público)/               inicio, clases (+detalle por estilo), instructores,
│  │                           crew-pro, galería, horarios, precios, contacto
│  ├─ registro/ · login/ · auth/
│  ├─ inscripcion/             wizard: paquete → horario → subir comprobante
│  ├─ mi-cuenta/                mis clases · mis cobros (estado de cuenta) · mis eventos · perfil
│  ├─ admin/                   dashboard, clases, instructores, eventos, cargos, alumnos, comprobantes, configuración
│  └─ api/cron/                recordatorios de clase, vencimiento de paquetes
├─ components/{ui,booking,account,admin}
├─ middleware.ts                sesión + protección de rutas + rate limiting
├─ vercel.json                  cron
└─ .env.example
```

## Modelo de seguridad (resumen — detalle en ROADMAP.md)

1. RLS en todas las tablas; un alumno solo lee/escribe lo suyo.
2. El alumno no inserta directo en `enrollments`: pasa por RPCs que validan
   cupo y reglas de negocio.
3. Comprobantes en **bucket privado**, nunca URL pública; solo el alumno dueño
   y el admin acceden (vía RLS + URL firmada).
4. El comprobante se **verifica automáticamente**: el cargo pasa a pagado solo
   si el monto coincide con lo esperado y la referencia SINPE no se reutilizó.
   Por eso esas dos validaciones son innegociables — sin ellas, un comprobante
   falso o reciclado se auto-aprobaría solo. Casos que no cumplen ambas
   condiciones quedan en revisión manual, nunca se aprueban a ciegas.
5. Detección de reutilización: **índice único en la referencia SINPE** —
   impide a nivel de base de datos que el mismo comprobante active dos cargos.
6. Rate limiting, headers de seguridad (CSP/HSTS/etc.), validación Zod en todos
   los inputs — igual que en Base.

## Cómo empezar (cuando se scaffoldee el proyecto)

```bash
npm install
cp .env.example .env.local   # llenar con las llaves de Supabase, Resend, Gemini
npm run dev
```

Detalle de variables de entorno y setup de Supabase/Resend en `SETUP.md` (se
crea junto con el scaffold del proyecto, siguiendo el mismo patrón que Base).
