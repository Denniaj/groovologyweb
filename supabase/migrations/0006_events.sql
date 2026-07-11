-- Fase 1 — events y event_participants
-- Participación opcional. Sin precio fijo de catálogo: los montos cambian
-- de competencia a competencia. Las columnas default_*_crc son montos de
-- REFERENCIA opcionales que el admin fija al armar el evento; join_event
-- los usa para generar los cargos del participante, y luego el admin puede
-- editar cada cargo por alumno (talla/rol) o corregirlo antes de que pague.

create table events (
  id                       uuid primary key default gen_random_uuid(),
  name                     text not null,
  description              text,
  event_date               date,
  photo_url                text,
  status                   event_status not null default 'open',
  -- Montos de referencia (nullable = ese concepto no aplica para este evento):
  default_costume_crc      int check (default_costume_crc      >= 0),
  default_choreography_crc int check (default_choreography_crc >= 0),
  default_registration_crc int check (default_registration_crc >= 0),
  created_at               timestamptz not null default now()
);

create index events_status_idx on events (status);

-- Solo los alumnos que se unen a ese evento en particular.
create table event_participants (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, student_id)
);

create index event_participants_student_idx on event_participants (student_id);
