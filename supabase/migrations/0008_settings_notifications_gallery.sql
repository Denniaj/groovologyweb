-- Fase 1 — settings, admin_notifications, gallery_photos

-- ---------------------------------------------------------------------
-- settings: fila única (id = 1) con la configuración del sitio.
-- ---------------------------------------------------------------------
create table settings (
  id                integer primary key default 1 check (id = 1),
  whatsapp          text,
  contact_email     text,
  address           text,
  google_maps_url   text,
  instagram         text,
  tiktok            text,
  facebook          text,      -- YouTube no, por ahora
  sinpe_number      text,      -- número SINPE para recibir pagos
  enrollments_open  boolean not null default true, -- toggle global
  updated_at        timestamptz not null default now()
);

create trigger settings_set_updated_at
  before update on settings
  for each row execute function set_updated_at();

-- Fila única inicial.
insert into settings (id) values (1);

-- ---------------------------------------------------------------------
-- admin_notifications: bandeja del panel admin.
-- ---------------------------------------------------------------------
create table admin_notifications (
  id              uuid primary key default gen_random_uuid(),
  type            notification_type not null,
  message         text,
  reference_table text,          -- tabla del registro origen
  reference_id    uuid,          -- id del registro origen
  is_read         boolean not null default false,
  created_at      timestamptz not null default now()
);

create index admin_notifications_unread_idx on admin_notifications (is_read, created_at desc);

-- ---------------------------------------------------------------------
-- gallery_photos: galería pública. Bucket de Storage público (a diferencia
-- del de comprobantes, que es privado). Alimentada 100% por el admin.
-- ---------------------------------------------------------------------
create table gallery_photos (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  category    gallery_category,          -- opcional
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index gallery_photos_category_idx on gallery_photos (category);
