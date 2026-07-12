-- Fase 3 — Row Level Security (idempotente: se puede re-ejecutar)
-- Regla general: el alumno solo ve/toca lo suyo; el admin ve todo; el
-- catálogo público es de solo lectura para cualquiera. Las escrituras de la
-- app van con service-role (que ignora RLS) o por RPC SECURITY DEFINER, así
-- que activar RLS no rompe el backend existente.

-- ---------------------------------------------------------------------
-- Helper: ¿el usuario actual es admin? SECURITY DEFINER para que consultar
-- profiles dentro de la policy no dispare recursión de RLS.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- El conteo de cupo debe ver todas las inscripciones, sin importar quién
-- llame; con RLS activo, se vuelve SECURITY DEFINER para no subcontar.
alter function public.get_available_capacity(uuid) security definer;

-- =====================================================================
-- Catálogo público: lectura para todos, escritura solo admin.
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['dance_styles','instructors','crew_members','packages','classes','events','gallery_photos','settings']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I on %I;', t||'_select_public', t);
    execute format('create policy %I on %I for select using (true);', t||'_select_public', t);
    execute format('drop policy if exists %I on %I;', t||'_admin_all', t);
    execute format('create policy %I on %I for all using (is_admin()) with check (is_admin());', t||'_admin_all', t);
  end loop;
end $$;

-- =====================================================================
-- profiles: cada quien su fila; admin todas.
-- =====================================================================
alter table profiles enable row level security;

drop policy if exists profiles_select_own on profiles;
create policy profiles_select_own on profiles
  for select using (id = auth.uid() or is_admin());

drop policy if exists profiles_update_own on profiles;
create policy profiles_update_own on profiles
  for update using (id = auth.uid() or is_admin()) with check (id = auth.uid() or is_admin());

drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles
  for all using (is_admin()) with check (is_admin());

-- Un alumno NO puede ascenderse a admin (ni tocar columnas de sistema):
-- en Postgres un revoke a nivel de columna NO anula el grant de UPDATE a
-- nivel de tabla que Supabase concede por defecto. Por eso se revoca el
-- UPDATE de tabla y se concede solo en las columnas editables (sin `role`).
-- El service-role conserva sus permisos y sigue pudiendo todo.
revoke update on profiles from anon, authenticated;
grant update (first_name, last_name, email, phone, birth_date, national_id, is_new_student)
  on profiles to authenticated;

-- =====================================================================
-- Tablas del alumno: ve solo lo suyo; escritura solo admin (la app usa
-- RPC SECURITY DEFINER o service-role).
-- =====================================================================
alter table enrollments enable row level security;
drop policy if exists enrollments_select_own on enrollments;
create policy enrollments_select_own on enrollments
  for select using (student_id = auth.uid() or is_admin());
drop policy if exists enrollments_admin_write on enrollments;
create policy enrollments_admin_write on enrollments
  for all using (is_admin()) with check (is_admin());

alter table enrollment_classes enable row level security;
drop policy if exists enrollment_classes_select_own on enrollment_classes;
create policy enrollment_classes_select_own on enrollment_classes
  for select using (
    exists (select 1 from enrollments e
            where e.id = enrollment_id and (e.student_id = auth.uid() or is_admin()))
  );
drop policy if exists enrollment_classes_admin_write on enrollment_classes;
create policy enrollment_classes_admin_write on enrollment_classes
  for all using (is_admin()) with check (is_admin());

alter table trial_classes enable row level security;
drop policy if exists trial_classes_select_own on trial_classes;
create policy trial_classes_select_own on trial_classes
  for select using (student_id = auth.uid() or is_admin());
drop policy if exists trial_classes_admin_write on trial_classes;
create policy trial_classes_admin_write on trial_classes
  for all using (is_admin()) with check (is_admin());

alter table event_participants enable row level security;
drop policy if exists event_participants_select_own on event_participants;
create policy event_participants_select_own on event_participants
  for select using (student_id = auth.uid() or is_admin());
drop policy if exists event_participants_admin_write on event_participants;
create policy event_participants_admin_write on event_participants
  for all using (is_admin()) with check (is_admin());

alter table charges enable row level security;
drop policy if exists charges_select_own on charges;
create policy charges_select_own on charges
  for select using (student_id = auth.uid() or is_admin());
drop policy if exists charges_admin_write on charges;
create policy charges_admin_write on charges
  for all using (is_admin()) with check (is_admin());

alter table payment_receipts enable row level security;
drop policy if exists payment_receipts_select_own on payment_receipts;
create policy payment_receipts_select_own on payment_receipts
  for select using (
    exists (select 1 from charges c
            where c.id = charge_id and (c.student_id = auth.uid() or is_admin()))
  );
drop policy if exists payment_receipts_admin_write on payment_receipts;
create policy payment_receipts_admin_write on payment_receipts
  for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- admin_notifications: solo admin.
-- =====================================================================
alter table admin_notifications enable row level security;
drop policy if exists admin_notifications_admin_all on admin_notifications;
create policy admin_notifications_admin_all on admin_notifications
  for all using (is_admin()) with check (is_admin());
