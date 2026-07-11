-- Extensão para gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- perfis (extensão de auth.users)
-- ============================================================
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  telefone text,
  created_at timestamptz not null default now()
);

alter table public.perfis enable row level security;

create policy "perfis_select_own"
  on public.perfis for select
  using (auth.uid() = id);

create policy "perfis_insert_own"
  on public.perfis for insert
  with check (auth.uid() = id);

create policy "perfis_update_own"
  on public.perfis for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "perfis_delete_own"
  on public.perfis for delete
  using (auth.uid() = id);

-- ============================================================
-- leads
-- ============================================================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references public.perfis (id) on delete cascade,
  nome text not null,
  telefone text not null,
  email text,
  origem text check (origem in ('instagram', 'indicacao', 'portal', 'placa', 'whatsapp', 'outro')),
  tipo_imovel text check (tipo_imovel in ('apartamento', 'casa', 'terreno', 'comercial')),
  finalidade text check (finalidade in ('comprar', 'alugar', 'investir')),
  regiao text,
  faixa_preco text,
  etapa text not null default 'novo' check (etapa in ('novo', 'em_contato', 'visita_agendada', 'proposta', 'fechado', 'perdido')),
  motivo_perda text,
  ultima_interacao timestamptz,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_corretor_id_idx on public.leads (corretor_id);

alter table public.leads enable row level security;

create policy "leads_select_own"
  on public.leads for select
  using (auth.uid() = corretor_id);

create policy "leads_insert_own"
  on public.leads for insert
  with check (auth.uid() = corretor_id);

create policy "leads_update_own"
  on public.leads for update
  using (auth.uid() = corretor_id)
  with check (auth.uid() = corretor_id);

create policy "leads_delete_own"
  on public.leads for delete
  using (auth.uid() = corretor_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_set_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- interacoes
-- ============================================================
create table public.interacoes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  tipo text not null check (tipo in ('ligacao', 'whatsapp', 'visita', 'observacao')),
  descricao text,
  data timestamptz not null default now()
);

create index interacoes_lead_id_idx on public.interacoes (lead_id);

alter table public.interacoes enable row level security;

create policy "interacoes_select_own"
  on public.interacoes for select
  using (exists (
    select 1 from public.leads
    where leads.id = interacoes.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "interacoes_insert_own"
  on public.interacoes for insert
  with check (exists (
    select 1 from public.leads
    where leads.id = interacoes.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "interacoes_update_own"
  on public.interacoes for update
  using (exists (
    select 1 from public.leads
    where leads.id = interacoes.lead_id
    and leads.corretor_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.leads
    where leads.id = interacoes.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "interacoes_delete_own"
  on public.interacoes for delete
  using (exists (
    select 1 from public.leads
    where leads.id = interacoes.lead_id
    and leads.corretor_id = auth.uid()
  ));

-- ============================================================
-- visitas
-- ============================================================
create table public.visitas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  data_hora timestamptz not null,
  status text not null default 'agendada' check (status in ('agendada', 'realizada', 'cancelada'))
);

create index visitas_lead_id_idx on public.visitas (lead_id);

alter table public.visitas enable row level security;

create policy "visitas_select_own"
  on public.visitas for select
  using (exists (
    select 1 from public.leads
    where leads.id = visitas.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "visitas_insert_own"
  on public.visitas for insert
  with check (exists (
    select 1 from public.leads
    where leads.id = visitas.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "visitas_update_own"
  on public.visitas for update
  using (exists (
    select 1 from public.leads
    where leads.id = visitas.lead_id
    and leads.corretor_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.leads
    where leads.id = visitas.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "visitas_delete_own"
  on public.visitas for delete
  using (exists (
    select 1 from public.leads
    where leads.id = visitas.lead_id
    and leads.corretor_id = auth.uid()
  ));
