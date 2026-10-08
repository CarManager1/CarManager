-- =====================================================================
-- Módulo de Atestados Médicos (escola de condução)
-- Correr uma vez no Supabase: SQL Editor -> colar -> Run
-- =====================================================================

-- Médicos que fazem os atestados e quanto se paga a cada um por atestado
create table if not exists public.medicos (
  id            bigint generated always as identity primary key,
  workshop_id   bigint not null references public.oficinas(id) on delete cascade,
  nome          text   not null,
  valor_atestado numeric(10,2) not null default 0,
  ativo         boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Marcações de atestados
create table if not exists public.atestados (
  id            bigint generated always as identity primary key,
  workshop_id   bigint not null references public.oficinas(id) on delete cascade,
  medico_id     bigint references public.medicos(id) on delete set null,
  data          date   not null,
  hora          time,
  nome_aluno    text   not null,
  documento     text,             -- nº CC / BI / NIF
  telemovel     text,
  categoria     text,             -- A, B, C, D, ...
  tipo          text,             -- Novo, Revalidação, Grupo 2, ...
  estado        text   not null default 'Marcado'
                check (estado in ('Marcado','Realizado','Faltou','Cancelado')),
  valor_medico  numeric(10,2) not null default 0,  -- valor a pagar ao médico (fica gravado no momento da marcação)
  valor_aluno   numeric(10,2) not null default 0,  -- valor cobrado ao aluno
  pago_medico   boolean not null default false,
  observacoes   text,
  created_at    timestamptz not null default now()
);

create index if not exists atestados_workshop_data_idx on public.atestados (workshop_id, data);

-- ---------------------------------------------------------------------
-- Segurança: cada escola só vê os seus dados (dono ou funcionário)
-- ---------------------------------------------------------------------
alter table public.medicos   enable row level security;
alter table public.atestados enable row level security;

create or replace function public.pode_aceder_escola(escola bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from oficinas o where o.id = escola and o.user_id = auth.uid())
      or exists (select 1 from mecanicos m where m.workshop_id = escola and m.email = auth.jwt() ->> 'email');
$$;

drop policy if exists "medicos_escola" on public.medicos;
create policy "medicos_escola" on public.medicos
  for all using (public.pode_aceder_escola(workshop_id))
  with check (public.pode_aceder_escola(workshop_id));

drop policy if exists "atestados_escola" on public.atestados;
create policy "atestados_escola" on public.atestados
  for all using (public.pode_aceder_escola(workshop_id))
  with check (public.pode_aceder_escola(workshop_id));
