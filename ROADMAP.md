# ROADMAP — Plan de construcción (Groovology)

Plan dividido por área/capa, no solo por feature — pensado para retomarlo en
cualquier punto y saber exactamente qué falta en cada dimensión del proyecto.
Basado en la infraestructura de `Base` (sitio de citas), adaptado a una
academia de baile: clases con horario recurrente en vez de citas 1-a-1,
paquetes/mensualidades en vez de pago por sesión, comprobantes de SINPE
Móvil en vez de pasarela de pago, y un estado de cuenta por alumno que cubre
tanto mensualidades como costos de eventos/competencias (vestuario, montaje,
inscripción).

No empieces una fase sin tener la anterior funcionando.

---

## Fase 0 — Infraestructura y entorno

- [ ] `npx create-next-app@latest` (TS, ESLint, Tailwind, App Router, sin `src/`)
- [ ] Proyecto en Supabase creado (región más cercana a Costa Rica)
- [ ] Proyecto en Vercel enlazado al repo de GitHub
- [ ] Cuenta Resend (correos transaccionales)
- [ ] Llave de Anthropic API (análisis de comprobantes SINPE)
- [ ] `shadcn/ui` inicializado (`npx shadcn@latest init`)
- [ ] `.env.local` completo, `npm run dev` levanta sin errores

**Listo cuando:** el proyecto corre local y tiene todos los servicios externos
provisionados (aunque vacíos).

---

## Fase 1 — Base de datos (Supabase / Postgres)

Diseño de esquema, en migraciones numeradas (`supabase/migrations/000N_*.sql`).

- [ ] `profiles` (id, role: `admin` | `student` — **sin rol `instructor` con
      login propio**, los instructores no necesitan cuenta, se administran
      como simple dato de catálogo; ver `instructors` abajo). Campos del
      registro: nombre, apellidos, email, teléfono, **fecha de nacimiento**
      (la edad se calcula al vuelo, no se guarda un número que se desactualiza),
      **cédula**, `is_new_student` (booleano: ¿es alumna nueva o ya venía
      tomando clases? — define si se le ofrece la clase de prueba)
- [ ] `dance_styles` (salsa, bachata, hip hop, etc. — nombre, descripción, nivel)
- [ ] `instructors` (nombre, bio, especialidades, foto — **tabla de catálogo,
      no de usuarios**; no requiere auth ni login, solo lo gestiona el admin)
- [ ] `crew_members` (equipo competitivo "Crew Pro": nombre, foto, logros/bio
      corta, orden — **misma lógica que `instructors`**: solo contenido de
      catálogo para la página de presentación, sin login ni lógica de aplicación)
- [ ] `classes` (estilo, nivel, instructor, día/hora recurrente, duración, cupo, salón)
- [ ] `packages` (planes de mensualidad por **frecuencia semanal**: 1 clase/semana,
      2 clases/semana, 3 clases/semana, o **ilimitado**; nombre, precio,
      vigencia en días — **todo alumno activo paga uno**, el monto depende del
      plan que eligió, no todos pagan lo mismo)
- [ ] `enrollments` (alumno, paquete, clase(s), estado: `pending_payment` /
      `active` / `expired` / `cancelled`, fecha inicio/fin) — genera el cargo
      recurrente de mensualidad (tipo `package` en `charges`). **Un alumno
      puede tener varias inscripciones activas a la vez** (varios estilos o
      incluso varios paquetes en paralelo) — no hay límite de una sola activa
- [ ] `enrollments.minor_name` (nullable): para clases de niños (ej. "Peques"),
      **el padre/madre es quien tiene la cuenta** (su nombre, cédula, email,
      paga y sube comprobantes) y simplemente escribe el nombre del niño en
      este campo al inscribirlo — no se crea un perfil/cuenta aparte para el
      menor. El roster de "estudiantes por clase" muestra el nombre del niño
      cuando este campo tiene valor, y si no, el nombre del alumno adulto
- [ ] `trial_classes` (control de la clase de prueba gratuita: alumno, clase,
      fecha tomada) con **constraint único por alumno a nivel de base de
      datos** (`UNIQUE(student_id)`) — si ya la usó, la opción de "Tomar clase
      de prueba" **ni siquiera debe aparecer** en su cuenta, y si de todas
      formas se intenta, el RPC/constraint lo rechaza. No es una alerta para
      que el admin lo note después: el sistema **bloquea el registro
      directamente**. Requiere estar registrado — no se ofrece como invitado
- [ ] `charges.type` incluye también `trial_extra`: clases sueltas a **₡2 000
      cada una** que un alumno nuevo puede tomar durante su semana de prueba,
      antes de decidirse por un paquete mensual (drop-in, no requiere paquete)
- [ ] `events` (competencias/festivales/showcases: nombre, descripción, fecha,
      foto, estado: `open` / `closed`) — **participación opcional**, no todos
      los alumnos están en un evento. **Sin precio fijo en la tabla**: cada
      evento tiene costos distintos (vestuario, montaje, inscripción cambian
      según la competencia), así que los montos los define el admin al
      momento de armar el evento, no un catálogo fijo
- [ ] `event_participants` (solo los alumnos que se unen a ese evento en
      particular — genera únicamente para ellos los cargos de vestuario,
      montaje e inscripción de ese evento). El admin define/edita el monto de
      cada cargo por participante (no todos pagan igual si, por ejemplo, el
      vestuario varía por talla/rol en la coreografía) y puede **corregirlo
      después** si el costo cambia antes de que el alumno pague
- [ ] `charges` — **tabla genérica de cobros** que junta ambos casos: cargos de
      mensualidad (todos los alumnos activos, monto según su plan) y cargos de
      evento (solo quienes están en `event_participants` de ese evento).
      Campos: alumno, tipo (`package` / `trial_extra` / `event_costume` /
      `event_choreography` / `event_registration` / `other`), descripción,
      monto, `enrollment_id` o `event_participant_id` (nullable, según el
      origen), fecha límite de pago, estado (`pending` / `paid` / `overdue` / `cancelled`)
- [ ] **Cargos en abonos/partes**: para eventos, el admin no siempre cobra el
      monto completo de una vez (ej. "mitad del vestuario ahora, resto
      después") y el split no es siempre igual. En vez de una lógica de cuotas
      fija en el sistema, el admin simplemente **crea tantos `charges` como
      necesite** por participante y concepto (ej. dos filas: "Vestuario —
      anticipo" y "Vestuario — saldo", cada una con su propio monto y fecha
      límite libremente definidos). Esto evita hardcodear un esquema de
      cuotas que no aplica igual en todos los eventos
- [ ] `overdue` en un cargo es **solo informativo** (fecha límite pasada y sin
      pagar) — el sistema **no expulsa ni cancela nada automáticamente**. Si un
      alumno no paga a tiempo, la decisión de qué hacer (retirarlo de la
      coreografía, darle más plazo, etc.) siempre la toma el admin manualmente
- [ ] `payment_receipts` (comprobante SINPE ligado a un `charge_id`: referencia,
      monto, remitente, fecha detectados por el análisis automático; estado
      `auto_approved` / `needs_review` / `rejected`; si un admin intervino en
      un caso `needs_review`, queda quién y cuándo; archivo en Storage). Un
      comprobante puede cubrir un solo cargo o, si el alumno sube un solo
      comprobante por varios cargos, dividirse manualmente por el admin.
- [ ] ~~`class_sessions` / control de asistencia~~ — **descartado**: no hace
      falta pasar lista ni llevar historial de asistencia por sesión; el
      roster de "estudiantes por clase" (Fase 6) alcanza con solo listar
      quién está inscrito
- [ ] `settings` (WhatsApp, email, dirección de la sede, redes sociales —
      **Instagram, TikTok, Facebook** (YouTube no, por ahora) —, número SINPE
      para recibir pagos, toggle "inscripciones abiertas")
- [ ] `admin_notifications` (tipo: `trial_requested` / `receipt_uploaded` /
      `event_joined` / `other`, referencia al registro origen, leída/no leída) —
      alimenta la bandeja de notificaciones del panel admin
- [ ] `gallery_photos` (galería pública: url de la foto en Storage, categoría
      opcional — clases / eventos / sede / general —, descripción corta,
      orden). Bucket de Storage **público** (a diferencia del de comprobantes,
      que es privado) ya que son fotos promocionales
- [ ] Constraint anti-sobrecupo: no permitir más inscripciones activas que el
      cupo de la clase (`CHECK`/trigger, igual que el `EXCLUDE` de Base para citas)
- [ ] Índice único en `payment_receipts.sinpe_reference` para evitar reutilizar
      el mismo comprobante en dos cargos distintos
- [ ] RPCs: `enroll_student`, `cancel_enrollment`, `get_available_capacity`,
      `join_event` (inscribe al alumno y genera sus `charges` de evento),
      `take_trial_class` (valida que no la haya usado antes, la marca en
      `trial_classes`, crea notificación para el admin), `get_student_balance`
      (resumen de cargos pendientes/pagados)

**Listo cuando:** las migraciones corren limpias en un proyecto Supabase nuevo
y los datos semilla (estilos, paquetes de ejemplo) quedan cargados.

---

## Fase 2 — Backend

- [ ] `lib/supabase/{client,server,admin}.ts` (mismo patrón que Base: `admin.ts`
      con service-role solo se importa en server actions/cron, nunca en cliente)
- [ ] Server Actions: registro (ver flujo abajo), login, inscribirse a
      clase/paquete, unirse a un evento, subir comprobante (ligado a un cargo específico)
- [ ] **Flujo de registro** (un solo formulario, todo junto): nombre, apellidos,
      email, contraseña, teléfono, fecha de nacimiento, cédula, y ¿es alumna
      nueva? →
      - si **no** es nueva: selecciona ya mismo su/sus paquete(s) y las
        clases en las que va a estar (puede marcar varias)
      - si **es** nueva: se le ofrece la clase de prueba en vez de forzarla a
        elegir paquete de una vez (puede elegir paquete después, desde su cuenta)
      - en cualquier caso: puede marcar si participa en algún evento/
        competencia abierto en ese momento
      - si la clase elegida es de niños (ej. "Peques"), al inscribirse pide
        el **nombre del menor** (`enrollments.minor_name`) — el adulto sigue
        siendo el titular de la cuenta, quien paga y sube comprobantes
      - al enviar el formulario, `enroll_student`/`join_event` generan
        automáticamente todos los `charges` correspondientes (mensualidad del
        paquete elegido + cargos del evento si marcó alguno)
- [ ] `takeTrialClass`: acción para "Tomar clase de prueba" — requiere sesión
      iniciada (nunca como invitado), valida vía `trial_classes` que el alumno
      no la haya usado antes (límite de una en la vida), la registra y crea un
      `admin_notifications` para avisar al equipo
- [ ] `bookExtraClass`: para alumnos en su semana de prueba que quieren tomar
      clases sueltas antes de decidirse por un paquete — crea un `charge` tipo
      `trial_extra` de ₡2 000 por clase
- [ ] `lib/receipts/`: sube el comprobante a Storage (bucket privado), llama a
      Claude API (visión) para extraer monto, referencia, remitente y fecha, y
      **decide automáticamente** sin intervención del admin:
      - si el monto extraído coincide con el del `charge` (tolerancia mínima)
        y la referencia SINPE no se usó antes → el cargo pasa a `paid` solo
        (y activa la inscripción si era de paquete); dispara el correo
      - si no coincide el monto, la referencia está repetida, o la extracción
        falla/no es legible → el cargo se queda en `pending`/pasa a un estado
        `needs_review`, visible en el panel para que el admin lo revise a mano
        **solo en ese caso excepcional** (no es el flujo normal)
- [ ] El panel admin **no tiene botón de confirmar/rechazar** para el caso
      normal: solo muestra, por alumno, si ya pagó o debe. La única acción
      manual es corregir los casos marcados `needs_review`
- [ ] Al crear/editar un evento y asignar participantes, generar automáticamente
      los `charges` de ese alumno (vestuario, montaje, inscripción) según los
      montos definidos por el admin para ese evento
- [ ] `lib/email/`: plantillas React Email (bienvenida, inscripción recibida,
      comprobante verificado/rechazado, recordatorio de clase, paquete por
      vencer, nuevo cargo de evento asignado, recordatorio de cargo pendiente)
- [ ] Cron (`app/api/cron/`): recordatorio de próxima clase, aviso de
      vencimiento de paquete (3 días antes), expirar paquetes vencidos,
      recordatorio de cargos (mensualidad o evento) próximos a su fecha límite
      o ya vencidos — **el cron solo avisa por correo**, nunca retira al
      alumno de un evento ni cancela nada; eso queda siempre a criterio del admin
- [ ] `lib/validations.ts` (Zod): formulario de registro (nombre, apellidos,
      email, teléfono, fecha de nacimiento válida, formato de cédula CR,
      selección de paquete/clases o marca de "alumna nueva", eventos
      opcionales), inscripción, unirse a evento, subida de comprobante (tipo
      de archivo, tamaño máximo)

**Listo cuando:** un alumno se inscribe (o se une a un evento), ve sus cargos
pendientes, sube un comprobante, el sistema lo verifica automáticamente y el
cargo/inscripción pasa a pagado/activo con su correo correspondiente en cada
paso — sin que un admin tenga que aprobarlo a mano en el caso normal.

---

## Fase 3 — Seguridad

- [ ] RLS en todas las tablas (alumno ve solo lo suyo; instructor ve sus clases;
      admin ve todo)
- [ ] Bucket de comprobantes **privado**, acceso solo vía URL firmada de corta duración
- [ ] **Verificación automática del comprobante**: el cargo se marca `paid`
      solo si el monto extraído coincide con el esperado y la referencia SINPE
      no se ha usado antes; no requiere clic de un admin en el caso normal.
      Esto es una decisión de producto (velocidad y menos trabajo manual), no
      un descuido de seguridad — por eso las validaciones duras de abajo son
      innegociables: sin ellas, un comprobante falso o reciclado se
      auto-aprobaría solo
- [ ] Deduplicación de comprobantes: **índice único en la referencia SINPE**
      (`payment_receipts.sinpe_reference`) — impide a nivel de base de datos
      que el mismo comprobante se reutilice para aprobar dos cargos, aunque el
      análisis de Claude falle en detectarlo
- [ ] Casos que la extracción no puede resolver con confianza (monto no
      coincide, imagen no legible, referencia duplicada) **nunca se
      auto-aprueban**: quedan en `needs_review` para que un admin los revise a mano
- [ ] Rate limiting por IP: registro, login, inscripción, subida de comprobantes
- [ ] Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) en `next.config.ts`
- [ ] Validación Zod en todos los inputs (frontend + server)
- [ ] Contraseñas con complejidad mínima
- [ ] Cron protegido con `CRON_SECRET` (comparación timing-safe)
- [ ] Páginas privadas no indexadas (`robots`/`noindex`): login, registro, mi-cuenta, admin
- [ ] Política de privacidad conforme a Ley 8968 (Costa Rica) — datos de alumnos y comprobantes

**Listo cuando:** un intento de leer/editar datos ajenos falla a nivel de base
de datos, no solo de UI.

---

## Fase 4 — Frontend / UI pública (landing)

- [ ] Inicio: hero, estilos de baile, instructores destacados, CTA a inscripción
- [ ] Clases y horarios (desde `classes`, filtrable por estilo/nivel/día). Cada
      estilo tiene su propia página de detalle ("Ver más": descripción larga,
      fotos, nivel, horario específico de ese estilo) — no solo una tarjeta
- [ ] Instructores (bio, especialidad, foto)
- [ ] **Crew Pro**: página de presentación del equipo competitivo (desde
      `crew_members` — fotos, logros, sin formulario de aplicación por ahora)
- [ ] Paquetes y precios (desde `packages`)
- [ ] Eventos/competencias (vitrina pública: nombre, fecha, fotos — sin mostrar
      montos ni participantes, eso es privado en `mi-cuenta`)
- [ ] **Galería** (desde `gallery_photos`, filtrable por categoría si aplica) —
      alimentada 100% por lo que el admin sube, sin fotos fijas en el código
- [ ] Sobre Groovology (historia, sede, ambiente)
- [ ] Contacto (formulario + WhatsApp + mapa de la sede)
- [ ] Legal: privacidad, términos, política de cancelación/reembolso
- [ ] Identidad visual propia: **blanco y negro de alto contraste, estética
      urbana/streetwear**, logo tipo grafiti/stencil, tipografía display en
      mayúsculas condensada para titulares — muy distinta a la paleta cálida
      de `Base`, según las referencias visuales de Groovology (mockups del
      home y de la página de clases)
- [ ] Diseño mobile-first, componentes compartidos en `components/ui/`

**Listo cuando:** el sitio comunica la propuesta de valor de Groovology y lleva
claramente a inscribirse.

---

## Fase 5 — Portal del alumno (perfil propio)

Cada alumno tiene su perfil (`/mi-cuenta`) con estas secciones:

- [ ] **Mis clases**: inscripciones activas/vencidas, próximas clases, horario.
      Si el alumno es nuevo (no ha usado su `trial_classes`), aparece la opción
      "Tomar clase de prueba" (gratis, límite de una); si ya está en su semana
      de prueba, opción de reservar clases sueltas a ₡2 000 c/u antes de elegir paquete
- [ ] **Mis cobros** (estado de cuenta): lista de `charges` pendientes/pagados/
      vencidos, con el detalle de origen (mensualidad, o evento → vestuario /
      montaje / inscripción por separado); subir comprobante por cargo y ver su
      estado (pendiente de revisión / verificado / rechazado)
- [ ] **Mis eventos**: competencias/festivales en los que participa, con el
      desglose de costos de cada uno y su estado de pago
- [ ] Cancelar inscripción a una clase/paquete
- [ ] Editar perfil (nombre, teléfono)

**Listo cuando:** un alumno ve exactamente cuánto debe y por qué concepto (clase
vs. evento), sube su comprobante por cargo, y el sistema lo verifica solo —
sin que el alumno tenga que preguntar por WhatsApp cuánto debe ni esperar a
que alguien lo revise a mano.

---

## Fase 6 — Panel de administración

**Mobile-first, no "también funciona en el celular"**: el admin va a operar
esto principalmente desde el teléfono, no desde un escritorio, así que el
panel se diseña primero para pantalla chica (formularios simples, listas en
vez de tablas anchas, sin depender de un componente de calendario tipo
grilla que no se usa bien con el dedo). Igual que en el sitio público, se
prueba en celular antes que en desktop, no al revés.

**Una sola fuente de verdad**: cuando el admin edita una clase (horario,
instructor asignado, foto del instructor, cupo, etc.) desde el celular, ese
cambio sale de inmediato en **todos** los lugares que muestran esa clase —
la página pública de horarios, la ficha del alumno, el roster de "estudiantes
por clase" — porque todos leen la misma tabla en la base de datos. No hay que
actualizar el dato en dos sitios distintos ni volver a publicar nada.

### Núcleo pedido

- [ ] **Dashboard / Notificaciones**: bandeja única de avisos — nuevas
      solicitudes de clase de prueba, comprobantes marcados `needs_review`
      (los que el sistema NO pudo aprobar solo), alumnos que se unieron a un
      evento; marcar como leída
- [ ] **Pagos pendientes / Pagos realizados**: vista de solo lectura —
      **nombre del alumno + estado** (`Pagó` / `Debe`), calculado
      **automáticamente** por la verificación del comprobante (ver Fase 2/3),
      **sin botones que el admin tenga que presionar** en el caso normal.
      Los pocos casos `needs_review` (monto no coincide, referencia repetida,
      imagen no legible) sí muestran una acción manual puntual para
      resolverlos — es la excepción, no la regla
- [ ] **Estudiantes por clase**: roster por clase con **nombre y apellidos**
      de cada alumno inscrito (útil para pasar lista o verificar en el salón)
- [ ] **Resumen financiero simple** en el dashboard: ingresos verificados del
      mes, total pendiente, total vencido — foto rápida de caja sin entrar a cada cargo
- [ ] **Exportar a CSV** (alumnos, pagos del mes) para lo contable
- [ ] **Buscador global de alumnos** (nombre, teléfono o email) en la barra
      superior, visible en todas las pantallas del panel
- [ ] Gestión de clases y horarios (crear/editar/eliminar, asignar instructor)
- [ ] Gestión de instructores (incluye subir/cambiar su foto)
- [ ] **Gestión de Crew Pro**: agregar/editar/eliminar miembros del equipo
      competitivo que aparecen en la página de presentación (nombre, foto, logros)
- [ ] **Gestión de galería**: subir foto (desde el celular, cámara o galería
      del teléfono), agregar descripción/categoría opcional, eliminar — se
      refleja de inmediato en la página pública de Galería
- [ ] Gestión de paquetes y precios (1/2/3 clases por semana, ilimitado)
- [ ] **Gestión de eventos**: crear evento, definir montos de vestuario/montaje/
      inscripción (cada evento con sus propios montos — no hay precio fijo de
      catálogo, varían de competencia a competencia), asignar participantes →
      genera sus `charges` automáticamente, con posibilidad de:
      - **editar el monto de un cargo individual** en cualquier momento
        (antes de que se pague) si el costo real cambia
      - **agregar cargos adicionales en abonos** (ej. "anticipo" + "saldo")
        con montos y fechas libres, cuando el pago no es de una sola vez
      - **retirar manualmente a un alumno de un evento** si no pagó — acción
        explícita del admin, el sistema nunca lo hace solo
- [ ] Búsqueda de alumnos + ficha (inscripciones, eventos, estado de cuenta
      completo, historial de pagos)
- [ ] Toggle "inscripciones abiertas" por estilo/clase (control de cupo)
- [ ] Configuración del sitio (WhatsApp, redes, número SINPE, dirección)

**Listo cuando:** el equipo de Groovology opera toda la academia (clases,
alumnos, pagos) sin tocar la base de datos directamente, y el estado de pago
de cada alumno se ve de un vistazo sin tener que confirmarlo a mano.

---

## Fase 7 — SEO / GEO

- [ ] Metadata por página (título, descripción, Open Graph, canonical, keywords)
- [ ] JSON-LD: `LocalBusiness`/`DanceSchool`, `Person` por instructor, `Course`/`Service`
      por estilo de baile, `FAQPage` si hay preguntas frecuentes
- [ ] `sitemap.xml`, `robots.txt`, `llms.txt`
- [ ] Google Business Profile de la sede
- [ ] Imágenes optimizadas (AVIF/WebP), blur placeholders

**Listo cuando:** el sitio es indexable, con datos estructurados correctos y
aparece en búsquedas locales ("academia de baile" + zona).

---

## Fase 8 — Pulido, QA y despliegue

- [ ] Lint y typecheck en verde
- [ ] QA responsive (celular, tablet, desktop)
- [ ] Revisar de punta a punta: inscripción → subida de comprobante →
      verificación admin → correo → clase visible en mi-cuenta
- [ ] Verificar dominio en Resend (SPF/DKIM/DMARC)
- [ ] Deploy final en Vercel + dominio real + pruebas en producción
- [ ] Mini guía de uso del panel para el equipo de Groovology

---

## Notas

- Cualquier cambio de esquema = migración nueva, no editar las ya aplicadas.
- El análisis automático de comprobantes es una ayuda operativa, no un sistema
  de aprobación de pagos: el riesgo de fraude (comprobantes falsos/reutilizados)
  se mitiga con revisión humana + deduplicación a nivel de base de datos, nunca
  solo con la lectura del modelo.
- Ver [`NECESITAMOS.md`](./NECESITAMOS.md) para todo lo que depende del equipo
  de Groovology (contenido, cuentas, decisiones de producto) antes de poder
  avanzar cada fase.
