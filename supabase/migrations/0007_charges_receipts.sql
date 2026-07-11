-- Fase 1 — charges y payment_receipts

-- ---------------------------------------------------------------------
-- charges: tabla genérica de cobros. Junta mensualidad (todo alumno
-- activo, monto según su plan) y cargos de evento (solo participantes).
-- Los abonos en partes se modelan como VARIOS charges (ej. "Vestuario —
-- anticipo" + "Vestuario — saldo"), no como un esquema de cuotas fijo.
-- ---------------------------------------------------------------------
create table charges (
  id                   uuid primary key default gen_random_uuid(),
  student_id           uuid not null references profiles (id) on delete cascade,
  type                 charge_type not null,
  description          text,
  amount_crc           int not null check (amount_crc >= 0),
  -- Origen del cargo (según el tipo). Nullable: 'trial_extra'/'other' pueden
  -- no tener ninguno; 'package' apunta a enrollment; 'event_*' a participante.
  enrollment_id        uuid references enrollments (id) on delete set null,
  event_participant_id uuid references event_participants (id) on delete cascade,
  due_date             date,
  status               charge_status not null default 'pending',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  -- Coherencia origen ↔ tipo:
  constraint charges_package_needs_enrollment
    check (type <> 'package' or enrollment_id is not null),
  constraint charges_event_needs_participant
    check (type not in ('event_costume','event_choreography','event_registration')
           or event_participant_id is not null)
);

comment on column charges.status is
  '''overdue'' es solo informativo (venció sin pagar); el sistema no cancela '
  'ni retira nada automáticamente, eso lo decide el admin.';

create index charges_student_idx on charges (student_id);
create index charges_status_idx on charges (status);
create index charges_enrollment_idx on charges (enrollment_id);
create index charges_event_participant_idx on charges (event_participant_id);

create trigger charges_set_updated_at
  before update on charges
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- payment_receipts: comprobante SINPE ligado a un charge. Los campos
-- (referencia, monto, remitente, fecha) los detecta el análisis automático
-- (Gemini). El bucket de archivos es privado (Fase 3).
-- ---------------------------------------------------------------------
create table payment_receipts (
  id              uuid primary key default gen_random_uuid(),
  charge_id       uuid not null references charges (id) on delete cascade,
  sinpe_reference text,                          -- referencia detectada
  amount_crc      int,                            -- monto detectado
  sender_name     text,                           -- remitente detectado
  payment_date    date,                           -- fecha detectada
  status          receipt_status not null default 'needs_review',
  file_path       text not null,                  -- ruta en Storage (bucket privado)
  -- Si un admin intervino un caso needs_review, queda quién y cuándo:
  reviewed_by     uuid references profiles (id) on delete set null,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index payment_receipts_charge_idx on payment_receipts (charge_id);
create index payment_receipts_status_idx on payment_receipts (status);

-- Deduplicación: la misma referencia SINPE no puede reutilizarse para
-- aprobar dos cargos, aunque el análisis falle en detectarlo. Solo aplica
-- a valores no nulos (una extracción ilegible deja la referencia en null).
create unique index payment_receipts_sinpe_reference_idx
  on payment_receipts (sinpe_reference)
  where sinpe_reference is not null;
