-- Fase 1 — profiles + alta automática al registrarse en auth
-- La edad se calcula al vuelo desde birth_date (no se guarda un número que
-- se desactualiza). La cédula y la fecha de nacimiento son datos sensibles
-- (ver política de privacidad, Ley 8968).

create table profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  role          user_role   not null default 'student',
  first_name    text        not null,          -- nombre
  last_name     text        not null,          -- apellidos
  email         text        not null,
  phone         text,
  birth_date    date,                           -- edad = age(birth_date) al vuelo
  national_id   text,                           -- cédula
  is_new_student boolean    not null default true, -- ¿alumna nueva? define clase de prueba
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on column profiles.is_new_student is
  'true = nunca ha tomado clases; define si se le ofrece la clase de prueba gratis';
comment on column profiles.birth_date is
  'La edad se calcula con age(birth_date); no se persiste un entero.';

create index profiles_role_idx on profiles (role);
create unique index profiles_email_idx on profiles (lower(email));

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------
-- Alta automática de perfil cuando auth crea un usuario.
-- El formulario de registro (Fase 2) pasa los datos en raw_user_meta_data.
-- ---------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, first_name, last_name, phone, birth_date, national_id, is_new_student
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'phone',
    (new.raw_user_meta_data ->> 'birth_date')::date,
    new.raw_user_meta_data ->> 'national_id',
    coalesce((new.raw_user_meta_data ->> 'is_new_student')::boolean, true)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
