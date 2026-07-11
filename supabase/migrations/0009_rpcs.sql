-- Fase 1 — RPCs (funciones de aplicación)
-- SECURITY DEFINER: la autorización fina se refuerza con RLS en Fase 3.

-- ---------------------------------------------------------------------
-- enroll_student: inscribe a un alumno en un paquete + una o varias clases
-- y genera automáticamente su cargo de mensualidad. La inscripción nace
-- 'pending_payment'; el trigger de cupo valida cada clase. Devuelve el id.
-- ---------------------------------------------------------------------
create or replace function enroll_student(
  p_student_id uuid,
  p_package_id uuid,
  p_class_ids  uuid[],
  p_minor_name text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_enrollment_id uuid;
  v_price         int;
  v_duration      int;
  v_class_id      uuid;
begin
  select price_crc, duration_days into v_price, v_duration
  from packages
  where id = p_package_id and is_active;

  if v_price is null then
    raise exception 'Paquete % no existe o está inactivo', p_package_id;
  end if;

  insert into enrollments (student_id, package_id, status, minor_name, start_date, end_date)
  values (p_student_id, p_package_id, 'pending_payment', p_minor_name,
          current_date, current_date + v_duration)
  returning id into v_enrollment_id;

  foreach v_class_id in array coalesce(p_class_ids, array[]::uuid[])
  loop
    insert into enrollment_classes (enrollment_id, class_id)
    values (v_enrollment_id, v_class_id);
  end loop;

  -- Cargo de mensualidad del paquete elegido.
  insert into charges (student_id, type, description, amount_crc, enrollment_id, due_date, status)
  values (p_student_id, 'package',
          (select 'Mensualidad — ' || name from packages where id = p_package_id),
          v_price, v_enrollment_id, current_date, 'pending');

  return v_enrollment_id;
end;
$$;

-- ---------------------------------------------------------------------
-- cancel_enrollment: marca la inscripción como cancelada y cancela sus
-- cargos de mensualidad que aún estaban pendientes (no toca los pagados).
-- ---------------------------------------------------------------------
create or replace function cancel_enrollment(p_enrollment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update enrollments set status = 'cancelled'
  where id = p_enrollment_id;

  update charges set status = 'cancelled'
  where enrollment_id = p_enrollment_id
    and type = 'package'
    and status in ('pending', 'overdue');
end;
$$;

-- ---------------------------------------------------------------------
-- join_event: inscribe al alumno en un evento y genera sus cargos a partir
-- de los montos de referencia del evento (solo los conceptos con monto
-- definido). El admin puede editar cada cargo por participante después.
-- Crea también la notificación para el admin. Devuelve el id del participante.
-- ---------------------------------------------------------------------
create or replace function join_event(
  p_event_id   uuid,
  p_student_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_participant_id uuid;
  v_event          events%rowtype;
begin
  select * into v_event from events where id = p_event_id;
  if v_event.id is null then
    raise exception 'Evento % no existe', p_event_id;
  end if;
  if v_event.status <> 'open' then
    raise exception 'El evento % no está abierto a inscripciones', p_event_id;
  end if;

  insert into event_participants (event_id, student_id)
  values (p_event_id, p_student_id)
  returning id into v_participant_id;

  if v_event.default_costume_crc is not null then
    insert into charges (student_id, type, description, amount_crc, event_participant_id, due_date)
    values (p_student_id, 'event_costume', 'Vestuario — ' || v_event.name,
            v_event.default_costume_crc, v_participant_id, v_event.event_date);
  end if;

  if v_event.default_choreography_crc is not null then
    insert into charges (student_id, type, description, amount_crc, event_participant_id, due_date)
    values (p_student_id, 'event_choreography', 'Montaje — ' || v_event.name,
            v_event.default_choreography_crc, v_participant_id, v_event.event_date);
  end if;

  if v_event.default_registration_crc is not null then
    insert into charges (student_id, type, description, amount_crc, event_participant_id, due_date)
    values (p_student_id, 'event_registration', 'Inscripción — ' || v_event.name,
            v_event.default_registration_crc, v_participant_id, v_event.event_date);
  end if;

  insert into admin_notifications (type, message, reference_table, reference_id)
  values ('event_joined',
          'Un alumno se unió al evento ' || v_event.name,
          'event_participants', v_participant_id);

  return v_participant_id;
end;
$$;

-- ---------------------------------------------------------------------
-- take_trial_class: registra la clase de prueba gratis (una en la vida).
-- El UNIQUE(student_id) de trial_classes es la barrera real; aquí se
-- traduce a un mensaje claro. Crea la notificación para el admin.
-- ---------------------------------------------------------------------
create or replace function take_trial_class(
  p_student_id uuid,
  p_class_id   uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trial_id uuid;
begin
  begin
    insert into trial_classes (student_id, class_id)
    values (p_student_id, p_class_id)
    returning id into v_trial_id;
  exception when unique_violation then
    raise exception 'Este alumno ya usó su clase de prueba gratuita'
      using errcode = 'unique_violation';
  end;

  insert into admin_notifications (type, message, reference_table, reference_id)
  values ('trial_requested', 'Nueva solicitud de clase de prueba',
          'trial_classes', v_trial_id);

  return v_trial_id;
end;
$$;

-- ---------------------------------------------------------------------
-- get_student_balance: resumen del estado de cuenta de un alumno.
-- ---------------------------------------------------------------------
create or replace function get_student_balance(p_student_id uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'total_pending',  coalesce(sum(amount_crc) filter (where status = 'pending'), 0),
    'total_overdue',  coalesce(sum(amount_crc) filter (where status = 'overdue'), 0),
    'total_paid',     coalesce(sum(amount_crc) filter (where status = 'paid'), 0),
    'count_pending',  count(*) filter (where status = 'pending'),
    'count_overdue',  count(*) filter (where status = 'overdue')
  )
  from charges
  where student_id = p_student_id;
$$;
