-- Fase 1 — classes y packages

-- ---------------------------------------------------------------------
-- packages: planes de mensualidad por frecuencia semanal.
-- Todo alumno activo paga uno; el monto depende del plan elegido.
-- ---------------------------------------------------------------------
create table packages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  frequency     package_frequency not null,
  price_crc     int  not null check (price_crc >= 0),  -- colones, sin decimales
  duration_days int  not null default 30 check (duration_days > 0),
  is_active     boolean not null default true,
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- classes: horario recurrente. La misma fila la leen la página pública,
-- la ficha del alumno y el roster admin (una sola fuente de verdad).
-- ---------------------------------------------------------------------
create table classes (
  id               uuid primary key default gen_random_uuid(),
  style_id         uuid not null references dance_styles (id) on delete restrict,
  instructor_id    uuid references instructors (id) on delete set null,
  level            class_level not null default 'todos',
  weekday          smallint not null check (weekday between 0 and 6), -- 0=domingo
  start_time       time not null,
  duration_minutes int  not null default 60 check (duration_minutes > 0),
  capacity         int  not null check (capacity > 0),
  room             text,                                 -- salón
  is_active        boolean not null default true,
  enrollment_open  boolean not null default true,        -- toggle "inscripciones abiertas" (Fase 6)
  created_at       timestamptz not null default now()
);

create index classes_style_idx on classes (style_id);
create index classes_instructor_idx on classes (instructor_id);
create index classes_weekday_idx on classes (weekday);
