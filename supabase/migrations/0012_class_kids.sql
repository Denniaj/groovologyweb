-- Fase 4 (datos) — marcar clases de niños sin poner "Peques" en el nombre.
-- El nivel (principiante/intermedio/...) ya existe en classes.level; esto
-- agrega la marca de "niños" para mostrar un badge KIDS y filtrar por Peques.

alter table classes
  add column if not exists is_kids boolean not null default false;

comment on column classes.is_kids is
  'true = clase para niños (se muestra badge KIDS y entra en el filtro Peques)';
