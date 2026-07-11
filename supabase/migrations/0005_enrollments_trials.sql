-- Fase 1 — enrollments, enrollment_classes, trial_classes
-- Un alumno puede tener VARIAS inscripciones activas a la vez (varios
-- estilos o paquetes en paralelo). No hay límite de una sola activa.

-- ---------------------------------------------------------------------
-- enrollments: alumno + paquete + estado + vigencia.
-- Las clases concretas que cubre van en enrollment_classes (una
-- inscripción puede abarcar varias clases según la frecuencia del paquete).
-- ---------------------------------------------------------------------
create table enrollments (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references profiles (id) on delete cascade,
  package_id  uuid references packages (id) on delete restrict,
  status      enrollment_status not null default 'pending_payment',
  minor_name  text,                              -- nombre del menor (clases de niños)
  start_date  date not null default current_date,
  end_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column enrollments.minor_name is
  'Para clases de niños: el adulto es el titular de la cuenta y escribe aquí '
  'el nombre del menor. No se crea perfil aparte para el menor.';

create index enrollments_student_idx on enrollments (student_id);
create index enrollments_status_idx on enrollments (status);

create trigger enrollments_set_updated_at
  before update on enrollments
  for each row execute function set_updated_at();

-- Clases cubiertas por cada inscripción (N a N).
create table enrollment_classes (
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  class_id      uuid not null references classes (id) on delete restrict,
  primary key (enrollment_id, class_id)
);

create index enrollment_classes_class_idx on enrollment_classes (class_id);

-- ---------------------------------------------------------------------
-- trial_classes: clase de prueba gratis, UNA por alumno en la vida.
-- El UNIQUE(student_id) es la barrera dura a nivel de base de datos:
-- si ya la usó, el registro se rechaza aquí, no es una alerta posterior.
-- ---------------------------------------------------------------------
create table trial_classes (
  id         uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  class_id   uuid not null references classes (id) on delete restrict,
  taken_at   date not null default current_date,
  created_at timestamptz not null default now(),
  unique (student_id)                            -- una en la vida
);

-- ---------------------------------------------------------------------
-- Cupo disponible de una clase. Cuentan como ocupados los enrollment_classes
-- cuya inscripción está 'pending_payment' o 'active' (se reserva el lugar
-- desde el registro, aunque el pago aún no se verifique).
-- ---------------------------------------------------------------------
create or replace function get_available_capacity(p_class_id uuid)
returns int
language sql
stable
as $$
  select c.capacity - coalesce((
    select count(*)
    from enrollment_classes ec
    join enrollments e on e.id = ec.enrollment_id
    where ec.class_id = p_class_id
      and e.status in ('pending_payment', 'active')
  ), 0)
  from classes c
  where c.id = p_class_id;
$$;

-- ---------------------------------------------------------------------
-- Anti-sobrecupo: al agregar una clase a una inscripción, no permitir más
-- ocupantes que la capacidad. Se bloquea la fila de la clase (FOR UPDATE)
-- para serializar inscripciones concurrentes (equivale al EXCLUDE de Base).
-- ---------------------------------------------------------------------
create or replace function check_class_capacity()
returns trigger
language plpgsql
as $$
declare
  v_capacity int;
  v_occupied int;
begin
  select capacity into v_capacity
  from classes
  where id = new.class_id
  for update;

  select count(*) into v_occupied
  from enrollment_classes ec
  join enrollments e on e.id = ec.enrollment_id
  where ec.class_id = new.class_id
    and e.status in ('pending_payment', 'active');

  if v_occupied > v_capacity then
    raise exception 'Clase % sin cupo disponible (capacidad %)', new.class_id, v_capacity
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger enrollment_classes_capacity_check
  after insert on enrollment_classes
  for each row execute function check_class_capacity();
