-- Fase 3 — Rate limiting por IP (ventana fija, en Postgres, sin servicios externos)

create table if not exists rate_limits (
  key          text primary key,       -- ej. 'login:190.x.x.x'
  count        int not null default 0,
  window_start timestamptz not null default now()
);

alter table rate_limits enable row level security;
-- Sin policies: solo el service-role (que ignora RLS) y el RPC definer acceden.

-- Devuelve true si la acción está PERMITIDA, false si se pasó del límite.
-- Ventana fija: cuenta intentos por clave dentro de p_window_seconds.
create or replace function check_rate_limit(
  p_key text,
  p_max int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
  v_start timestamptz;
begin
  select count, window_start into v_count, v_start
  from rate_limits where key = p_key
  for update;

  if not found then
    insert into rate_limits (key, count, window_start)
    values (p_key, 1, now())
    on conflict (key) do update set count = 1, window_start = now();
    return true;
  end if;

  -- Ventana vencida: reiniciar.
  if v_start < now() - make_interval(secs => p_window_seconds) then
    update rate_limits set count = 1, window_start = now() where key = p_key;
    return true;
  end if;

  -- Dentro de la ventana: ¿ya llegó al tope?
  if v_count >= p_max then
    return false;
  end if;

  update rate_limits set count = count + 1 where key = p_key;
  return true;
end;
$$;
