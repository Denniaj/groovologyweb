# NECESITAMOS — Insumos y decisiones pendientes

Todo lo que no es código: cuentas por crear, contenido por aportar y
decisiones de producto que hay que tomar antes de (o durante) cada fase del
[`ROADMAP.md`](./ROADMAP.md). Sin esto, el desarrollo puede avanzar con datos
de ejemplo, pero no se puede lanzar.

---

## 1. Cuentas y servicios externos

- [ ] **Supabase**: proyecto creado (base de datos + auth + storage)
- [ ] **Vercel**: cuenta enlazada al repo de GitHub para hosting/deploy
- [ ] **Resend**: cuenta para correos transaccionales
- [ ] **Gemini (Google AI)**: API key para el análisis de comprobantes SINPE
- [ ] **Dominio**: nombre definitivo (¿`groovology.com`, `.cr`, otro?) — comprarlo
      a nombre de Groovology
- [ ] **Google Business Profile** de la sede (clave para SEO local)
- [x] Redes sociales: **Instagram, TikTok, Facebook y WhatsApp** (YouTube no,
      por ahora). Confirmado — falta el link/usuario de cada una.

## 2. Datos del negocio

- [ ] Nombre legal/comercial completo, cédula jurídica si aplica
- [ ] Dirección exacta de la sede + link de Google Maps
- [ ] Horario de atención / horario de clases real (para cargar `classes`)
- [ ] Número de WhatsApp de contacto
- [ ] Número de **SINPE Móvil** donde los alumnos deben depositar (el que el
      sistema usará como referencia para validar comprobantes)
- [ ] Correo de contacto oficial (para "from" de los correos, ideal
      `algo@groovology.com` tras verificar el dominio en Resend)

## 3. Catálogo (para cargar en base de datos)

- [ ] Lista de **estilos de baile** que se enseñan (salsa, bachata, hip hop,
      etc.) con descripción corta de cada uno
- [ ] Lista de **instructores**: nombre, bio corta, especialidad(es), foto
- [ ] Horario real de clases: estilo + nivel + instructor + día/hora + cupo por clase
- [ ] **Paquetes y precios**: precio exacto en colones de cada plan — 1
      clase/semana, 2 clases/semana, 3 clases/semana e ilimitado (confirmado
      que son las 4 opciones; falta el monto de cada una) — vigencia (¿mensual?)
- [ ] Política de cancelación/reembolso de paquetes (¿se puede pausar?
      ¿reembolso parcial?)
- [ ] **Duración exacta de la "semana de prueba"**: confirmado que la primera
      clase es gratis (única en la vida, con registro obligatorio) y que las
      siguientes cuestan ₡2 000 c/u antes de decidirse por un paquete — falta
      saber cuántos días dura esa ventana de ₡2 000/clase (¿7 días corridos
      desde la clase gratis? ¿un número de clases en vez de días?)
- [ ] **Eventos/competencias**: lista de eventos previstos (nombre, fecha) y,
      por cada uno, los conceptos de cobro típicos y sus montos — vestuario,
      montaje/coreografía, inscripción a la competencia (¿montos fijos por
      evento o varían por alumno/rol dentro de la coreografía?)

## 4. Contenido y assets visuales

- [ ] Logo en alta resolución (vector si es posible)
- [ ] Fotos profesionales: fachada/salón de la sede, clases en acción, cada
      instructor, ambiente general (para hero, `og-image`, etc.)
- [ ] Copy de "Sobre Groovology" (historia, misión, qué los diferencia)
- [ ] Paleta de marca / identidad visual si ya existe una definida; si no,
      se propondrá una acorde al rubro (más vibrante que la de `Base`)
- [ ] Videos cortos (opcional) para redes/hero, si los tienen

## 5. Legal (Costa Rica)

- [ ] Política de privacidad — qué datos se guardan (perfil, **cédula, fecha
      de nacimiento**, comprobantes de pago) y cómo se puede pedir su borrado
      (Ley 8968 / PRODHAB). La cédula y la fecha de nacimiento son datos de
      identificación más sensibles que un simple perfil — deben mencionarse
      explícitamente en la política, no basta un texto genérico
- [ ] Términos de uso / condiciones de inscripción
- [ ] Texto de consentimiento para guardar comprobantes de pago y cédula (datos sensibles)
- [ ] Confirmar **para qué se usa la cédula** exactamente (identificación en
      competencias/seguros del evento, requisito de la sede, trámite legal) —
      afecta qué tan estricto debe ser el acceso a ese campo en `profiles`

## 6. Decisiones de producto pendientes

- [x] **Flujo de verificación de comprobantes**: **automático**, sin que el
      admin tenga que aprobar cada uno a mano. El sistema marca el cargo como
      pagado solo si el monto extraído coincide con el esperado y la
      referencia SINPE no se ha usado antes; el panel admin solo muestra
      nombre + estado (Pagó/Debe). **Riesgo a tener presente**: como no hay
      revisión humana en el caso normal, un comprobante alterado o mal leído
      por el OCR podría pasar si además logra imitar el monto exacto — por
      eso la deduplicación de referencia y la validación de monto son
      obligatorias y no se pueden quitar. Confirmado, ver ROADMAP Fase 2 y Fase 3.
- [ ] ¿Qué pasa si el comprobante subido no coincide en monto? Por ahora queda
      en `needs_review` para que el admin lo resuelva a mano (única excepción
      al flujo automático) — ¿se permite completar el faltante con un segundo
      comprobante, se rechaza directo, o queda pendiente con nota del admin?
- [x] ¿Un alumno puede tener más de una inscripción activa a la vez (varios
      estilos en paralelo)? **Sí, puede estar en varios o en todos los estilos
      a la vez** — no hay límite de una inscripción activa. Confirmado, ver
      ROADMAP Fase 1.
- [x] ¿Se permite reservar/inscribirse sin cuenta (como invitado) para la
      primera clase de prueba, o siempre requiere registro? **Siempre requiere
      registro** — no se ofrece como invitado. La clase de prueba es gratis,
      limitada a una por alumno en la vida; el alumno la selecciona desde su
      cuenta y el admin recibe notificación. Confirmado, ver ROADMAP Fase 1 y Fase 2.
- [x] ¿Se necesita control de asistencia por clase? **No** — alcanza con el
      roster de "estudiantes por clase" (lista de inscritos, sin check-in
      sesión por sesión). Confirmado, `class_sessions` queda descartado.
- [x] ¿Instructores necesitan su propio login? **No** — los instructores son
      solo un dato de catálogo (nombre, bio, foto, especialidad) que gestiona
      el admin; no tienen cuenta ni acceso propio. Confirmado, ver ROADMAP Fase 1.
- [x] Cargos de evento: **montos definidos por el admin al crear cada evento**
      (no hay precio fijo de catálogo, cambian de competencia a competencia) y
      **editables por alumno individual** en cualquier momento antes de pagar
      — confirmado, ver ROADMAP Fase 1 y Fase 6.
- [x] ¿Qué pasa si un alumno no paga el cargo de evento antes de la fecha
      límite? **Queda a criterio del admin** — el sistema solo marca el cargo
      como vencido (informativo) y avisa por correo; nunca retira al alumno
      del evento automáticamente. Confirmado, ver ROADMAP Fase 1 y Fase 6.
- [x] ¿Los cargos de evento tienen fecha límite única, o se pueden pagar en
      partes? **Se pagan en abonos casi siempre** (ej. mitad del vestuario
      primero, resto después), y el split **no es siempre igual** — por eso
      el admin crea cada abono como un cargo aparte con su propio monto y
      fecha, en vez de un esquema de cuotas fijo. Confirmado, ver ROADMAP Fase 1.

## 7. Después del lanzamiento (no bloquea el desarrollo)

- [ ] Alta en Google Search Console + sitemap
- [ ] Backlinks (redes, directorios de academias de baile en Costa Rica)
- [ ] Contenido adicional (blog/recursos: eventos, competencias, testimonios)

---

Cada ítem marcado aquí es responsabilidad del equipo de Groovology (contenido,
cuentas, decisiones) — el desarrollo puede seguir avanzando con datos de
ejemplo mientras se van resolviendo, pero varias fases del ROADMAP (sobre todo
Fase 1, 4 y 7) necesitan esta información real para no quedar a medias.
