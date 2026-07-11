-- Fase 1 — Tipos enumerados y helpers compartidos
-- No editar migraciones ya aplicadas: cualquier cambio = migración nueva.

-- =====================================================================
-- Tipos enumerados
-- =====================================================================

-- Rol de usuario. NO existe 'instructor' con login: los instructores son
-- catálogo (ver 0003). Solo admin y student tienen cuenta.
create type user_role as enum ('admin', 'student');

-- Nivel usado por dance_styles y classes.
create type class_level as enum ('principiante', 'intermedio', 'avanzado', 'todos');

-- Frecuencia semanal del paquete de mensualidad. 'unlimited' = sin tope.
create type package_frequency as enum ('weekly_1', 'weekly_2', 'weekly_3', 'unlimited');

-- Estado de una inscripción (enrollments).
create type enrollment_status as enum ('pending_payment', 'active', 'expired', 'cancelled');

-- Tipo de cargo (charges) — junta mensualidad y costos de evento.
create type charge_type as enum (
  'package',              -- mensualidad del paquete elegido
  'trial_extra',          -- clase suelta ₡2 000 en semana de prueba
  'event_costume',        -- vestuario del evento
  'event_choreography',   -- montaje/coreografía del evento
  'event_registration',   -- inscripción a la competencia
  'other'                 -- cualquier otro concepto puntual
);

-- Estado de un cargo. 'overdue' es SOLO informativo: el sistema no cancela
-- ni expulsa nada automáticamente (lo decide el admin).
create type charge_status as enum ('pending', 'paid', 'overdue', 'cancelled');

-- Estado de un comprobante tras el análisis automático (Gemini).
create type receipt_status as enum ('auto_approved', 'needs_review', 'rejected');

-- Estado de un evento.
create type event_status as enum ('open', 'closed');

-- Categoría opcional de una foto de galería.
create type gallery_category as enum ('clases', 'eventos', 'sede', 'general');

-- Tipo de notificación para la bandeja del admin.
create type notification_type as enum ('trial_requested', 'receipt_uploaded', 'event_joined', 'other');

-- =====================================================================
-- Helper: mantener updated_at al día
-- =====================================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
