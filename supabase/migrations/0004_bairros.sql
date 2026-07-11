-- Lista de bairros personalizada por corretor.
create table public.bairros (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references public.perfis (id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  unique (corretor_id, nome)
);

create index bairros_corretor_id_idx on public.bairros (corretor_id);

alter table public.bairros enable row level security;

create policy "bairros_select_own"
  on public.bairros for select
  using (auth.uid() = corretor_id);

create policy "bairros_insert_own"
  on public.bairros for insert
  with check (auth.uid() = corretor_id);

create policy "bairros_update_own"
  on public.bairros for update
  using (auth.uid() = corretor_id)
  with check (auth.uid() = corretor_id);

create policy "bairros_delete_own"
  on public.bairros for delete
  using (auth.uid() = corretor_id);

-- Bairros de interesse de um lead (N:N).
create table public.lead_bairros (
  lead_id uuid not null references public.leads (id) on delete cascade,
  bairro_id uuid not null references public.bairros (id) on delete cascade,
  primary key (lead_id, bairro_id)
);

create index lead_bairros_lead_id_idx on public.lead_bairros (lead_id);
create index lead_bairros_bairro_id_idx on public.lead_bairros (bairro_id);

alter table public.lead_bairros enable row level security;

create policy "lead_bairros_select_own"
  on public.lead_bairros for select
  using (exists (
    select 1 from public.leads
    where leads.id = lead_bairros.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "lead_bairros_insert_own"
  on public.lead_bairros for insert
  with check (exists (
    select 1 from public.leads
    where leads.id = lead_bairros.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "lead_bairros_delete_own"
  on public.lead_bairros for delete
  using (exists (
    select 1 from public.leads
    where leads.id = lead_bairros.lead_id
    and leads.corretor_id = auth.uid()
  ));
