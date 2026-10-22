-- Barbearia: tabela de marcações + funções públicas
-- Executar no Supabase: SQL Editor > New query > colar e correr.

create table if not exists public.barbearia_marcacoes (
  id            bigint generated always as identity primary key,
  created_at    timestamptz not null default now(),
  data          date not null,
  hora          time not null,
  duracao_min   int  not null check (duracao_min > 0),
  barbeiro_id   text not null,
  servico_id    text not null,
  servico_nome  text not null,
  preco         numeric(8,2) not null,
  cliente_nome  text not null,
  cliente_telefone text not null,
  cliente_email text,
  notas         text,
  estado        text not null default 'confirmada'
                check (estado in ('confirmada', 'concluida', 'cancelada', 'falta'))
);

create index if not exists barbearia_marcacoes_data_idx on public.barbearia_marcacoes (data, barbeiro_id);

-- Só utilizadores autenticados (a equipa) leem e alteram as marcações.
-- O público nunca acede diretamente à tabela: usa as funções abaixo.
alter table public.barbearia_marcacoes enable row level security;

drop policy if exists "equipa le marcacoes" on public.barbearia_marcacoes;
create policy "equipa le marcacoes" on public.barbearia_marcacoes
  for select to authenticated using (true);

drop policy if exists "equipa altera marcacoes" on public.barbearia_marcacoes;
create policy "equipa altera marcacoes" on public.barbearia_marcacoes
  for update to authenticated using (true) with check (true);

-- Horários ocupados num dia (sem dados pessoais dos clientes)
create or replace function public.barbearia_ocupados(p_data date)
returns table (barbeiro_id text, hora text, duracao_min int)
language sql
security definer
set search_path = public
as $$
  select m.barbeiro_id, to_char(m.hora, 'HH24:MI'), m.duracao_min
  from barbearia_marcacoes m
  where m.data = p_data and m.estado <> 'cancelada';
$$;

-- Cria uma marcação, garantindo que não há sobreposição para o barbeiro
create or replace function public.barbearia_marcar(
  p_data date,
  p_hora time,
  p_duracao_min int,
  p_barbeiro_id text,
  p_servico_id text,
  p_servico_nome text,
  p_preco numeric,
  p_cliente_nome text,
  p_cliente_telefone text,
  p_cliente_email text default null,
  p_notas text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_id bigint;
begin
  if p_data < current_date then
    raise exception 'Data inválida';
  end if;
  if length(trim(coalesce(p_cliente_nome, ''))) < 2 or length(trim(coalesce(p_cliente_telefone, ''))) < 9 then
    raise exception 'Nome e telefone são obrigatórios';
  end if;

  -- Serializa marcações do mesmo barbeiro no mesmo dia
  perform pg_advisory_xact_lock(hashtext(p_barbeiro_id || p_data::text));

  if exists (
    select 1 from barbearia_marcacoes m
    where m.data = p_data
      and m.barbeiro_id = p_barbeiro_id
      and m.estado <> 'cancelada'
      and p_hora < m.hora + make_interval(mins => m.duracao_min)
      and p_hora + make_interval(mins => p_duracao_min) > m.hora
  ) then
    raise exception 'HORARIO_OCUPADO';
  end if;

  insert into barbearia_marcacoes (
    data, hora, duracao_min, barbeiro_id, servico_id, servico_nome, preco,
    cliente_nome, cliente_telefone, cliente_email, notas
  ) values (
    p_data, p_hora, p_duracao_min, p_barbeiro_id, p_servico_id, p_servico_nome, p_preco,
    trim(p_cliente_nome), trim(p_cliente_telefone), nullif(trim(p_cliente_email), ''), nullif(trim(p_notas), '')
  )
  returning id into novo_id;

  return novo_id;
end;
$$;

grant execute on function public.barbearia_ocupados(date) to anon, authenticated;
grant execute on function public.barbearia_marcar(date, time, int, text, text, text, numeric, text, text, text, text) to anon, authenticated;
