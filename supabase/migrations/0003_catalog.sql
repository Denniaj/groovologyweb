-- Fase 1 — Catálogo puro (sin login ni lógica de aplicación)
-- dance_styles, instructors, crew_members: contenido que gestiona el admin.

-- ---------------------------------------------------------------------
-- dance_styles: salsa, bachata, hip hop, etc.
-- Cada estilo tiene su propia página de detalle en el sitio (Fase 4).
-- ---------------------------------------------------------------------
create table dance_styles (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null,             -- para la URL de detalle público
  short_description text,                       -- tarjeta / listado
  long_description  text,                       -- página "Ver más"
  level             class_level not null default 'todos',
  sort_order        int  not null default 0,
  created_at        timestamptz not null default now()
);

create unique index dance_styles_slug_idx on dance_styles (slug);

-- ---------------------------------------------------------------------
-- instructors: tabla de catálogo, NO de usuarios. Sin auth ni login.
-- ---------------------------------------------------------------------
create table instructors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  bio         text,
  specialties text[] not null default '{}',    -- especialidades
  photo_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- crew_members: equipo competitivo "Crew Pro". Misma lógica que
-- instructors: solo contenido para la página de presentación.
-- ---------------------------------------------------------------------
create table crew_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  bio         text,                             -- logros / bio corta
  photo_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);
