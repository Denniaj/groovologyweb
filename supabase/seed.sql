-- Fase 1 — Datos semilla (ejemplo)
-- Precios, horarios e instructores reales están pendientes (ver NECESITAMOS.md).
-- Estos valores permiten desarrollar y probar hasta tener los definitivos.

-- Estilos de baile ------------------------------------------------------
insert into dance_styles (name, slug, short_description, level, sort_order) values
  ('Salsa',   'salsa',   'Salsa en línea y cubana.',        'todos', 1),
  ('Bachata', 'bachata', 'Bachata sensual y dominicana.',   'todos', 2),
  ('Hip Hop', 'hip-hop', 'Hip hop urbano y coreográfico.',  'todos', 3);

-- Instructores (catálogo, sin login) -----------------------------------
insert into instructors (name, bio, specialties, sort_order) values
  ('Instructor de ejemplo 1', 'Bio pendiente.', array['Salsa','Bachata'], 1),
  ('Instructor de ejemplo 2', 'Bio pendiente.', array['Hip Hop'],         2);

-- Paquetes de mensualidad (precios de ejemplo en colones) --------------
insert into packages (name, frequency, price_crc, duration_days, sort_order) values
  ('1 clase por semana',  'weekly_1',  20000, 30, 1),
  ('2 clases por semana', 'weekly_2',  30000, 30, 2),
  ('3 clases por semana', 'weekly_3',  38000, 30, 3),
  ('Ilimitado',           'unlimited', 45000, 30, 4);

-- Clases de ejemplo (horario recurrente) -------------------------------
insert into classes (style_id, instructor_id, level, weekday, start_time, duration_minutes, capacity, room)
select s.id, i.id, 'todos', v.weekday, v.start_time, 60, v.capacity, v.room
from (values
  ('salsa',   'Instructor de ejemplo 1', 1, time '19:00', 20, 'Salón A'),  -- lunes
  ('bachata', 'Instructor de ejemplo 1', 3, time '19:00', 20, 'Salón A'),  -- miércoles
  ('hip-hop', 'Instructor de ejemplo 2', 5, time '18:00', 15, 'Salón B')   -- viernes
) as v(style_slug, instructor_name, weekday, start_time, capacity, room)
join dance_styles s on s.slug = v.style_slug
join instructors  i on i.name = v.instructor_name;

-- Crew Pro (ejemplo) ----------------------------------------------------
insert into crew_members (name, bio, sort_order) values
  ('Miembro Crew 1', 'Logros pendientes.', 1),
  ('Miembro Crew 2', 'Logros pendientes.', 2);

-- Evento de ejemplo (con montos de referencia) -------------------------
insert into events (name, description, event_date, status,
                    default_costume_crc, default_choreography_crc, default_registration_crc)
values ('Competencia de ejemplo', 'Descripción pendiente.',
        current_date + 60, 'open', 25000, 15000, 10000);

-- Configuración del sitio (placeholder) --------------------------------
update settings set
  instagram = '@groovology',
  enrollments_open = true
where id = 1;
