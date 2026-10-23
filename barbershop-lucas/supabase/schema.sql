-- Barber Shop Lucas — esquema da base de dados (Supabase / Postgres)
-- Corre este ficheiro no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  birthday date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  service_id text not null,
  day date not null,
  start_time text not null, -- HH:MM
  duration int not null default 30,
  status text not null default 'marcada' check (status in ('marcada', 'concluida', 'faltou', 'cancelada')),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appointments_day_idx on appointments(day);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  plan_id text not null,
  status text not null default 'pendente' check (status in ('pendente', 'ativa', 'cancelada')),
  start_date date,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  text text not null,
  recipients int not null default 0,
  created_at timestamptz not null default now()
);

-- Segurança: só utilizadores autenticados (o Lucas) acedem às tabelas.
alter table clients enable row level security;
alter table appointments enable row level security;
alter table subscriptions enable row level security;
alter table messages enable row level security;

drop policy if exists "staff_all" on clients;
drop policy if exists "staff_all" on appointments;
drop policy if exists "staff_all" on subscriptions;
drop policy if exists "staff_all" on messages;
create policy "staff_all" on clients for all to authenticated using (true) with check (true);
create policy "staff_all" on appointments for all to authenticated using (true) with check (true);
create policy "staff_all" on subscriptions for all to authenticated using (true) with check (true);
create policy "staff_all" on messages for all to authenticated using (true) with check (true);

-- Funções públicas usadas pelo site (não expõem dados dos clientes).

create or replace function get_busy_slots(p_day date)
returns table (start_time text, duration int)
language sql security definer set search_path = public as $$
  select a.start_time, a.duration from appointments a
  where a.day = p_day and a.status <> 'cancelada';
$$;

create or replace function upsert_client(p_name text, p_phone text, p_email text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if coalesce(trim(p_name), '') = '' or length(regexp_replace(p_phone, '\D', '', 'g')) < 9 then
    raise exception 'Nome e telemóvel são obrigatórios.';
  end if;
  insert into clients (name, phone, email)
  values (trim(p_name), regexp_replace(p_phone, '\D', '', 'g'), nullif(trim(p_email), ''))
  on conflict (phone) do update
    -- não altera dados de clientes existentes a partir do site público
    set email = coalesce(clients.email, excluded.email)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function book_appointment(
  p_name text, p_phone text, p_email text, p_service_id text,
  p_day date, p_start_time text, p_duration int, p_notes text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_client uuid;
  v_id uuid;
  v_duration int := least(greatest(coalesce(p_duration, 30), 15), 180);
begin
  if p_day < current_date then
    raise exception 'Data inválida.';
  end if;
  if p_start_time !~ '^\d{2}:\d{2}$' then
    raise exception 'Hora inválida.';
  end if;

  -- Evita marcações em simultâneo para o mesmo horário.
  perform pg_advisory_xact_lock(hashtext(p_day::text));
  if exists (
    select 1 from appointments a
    where a.day = p_day and a.status <> 'cancelada'
      and (p_start_time::time, p_start_time::time + make_interval(mins => v_duration))
          overlaps (a.start_time::time, a.start_time::time + make_interval(mins => a.duration))
  ) then
    raise exception 'Esse horário acabou de ser ocupado. Escolha outro, por favor.';
  end if;

  v_client := upsert_client(p_name, p_phone, p_email);
  insert into appointments (client_id, service_id, day, start_time, duration, notes)
  values (v_client, p_service_id, p_day, p_start_time, v_duration, nullif(trim(p_notes), ''))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function request_subscription(p_name text, p_phone text, p_email text, p_plan_id text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare v_client uuid; v_id uuid;
begin
  v_client := upsert_client(p_name, p_phone, p_email);
  insert into subscriptions (client_id, plan_id) values (v_client, p_plan_id)
  returning id into v_id;
  return v_id;
end;
$$;

revoke execute on function upsert_client(text, text, text) from public, anon;
grant execute on function get_busy_slots(date) to anon, authenticated;
grant execute on function book_appointment(text, text, text, text, date, text, int, text) to anon, authenticated;
grant execute on function request_subscription(text, text, text, text) to anon, authenticated;
