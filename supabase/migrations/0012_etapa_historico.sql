-- Histórico de transição de etapa por lead, pra calcular tempo médio parado
-- em cada etapa do funil e tempo médio até fechar. Populado via trigger em
-- leads (criação + toda troca de etapa), não escrito diretamente pelo app.
create table public.etapa_historico (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  etapa text not null,
  entrou_em timestamptz not null default now()
);

create index etapa_historico_lead_id_idx on public.etapa_historico (lead_id);

alter table public.etapa_historico enable row level security;

create policy "etapa_historico_select_own"
  on public.etapa_historico for select
  using (exists (
    select 1 from public.leads
    where leads.id = etapa_historico.lead_id
    and leads.corretor_id = auth.uid()
  ));

create policy "etapa_historico_insert_own"
  on public.etapa_historico for insert
  with check (exists (
    select 1 from public.leads
    where leads.id = etapa_historico.lead_id
    and leads.corretor_id = auth.uid()
  ));

create function public.registrar_etapa_historico()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.etapa_historico (lead_id, etapa, entrou_em)
    values (new.id, new.etapa, new.created_at);
  elsif (tg_op = 'UPDATE' and new.etapa is distinct from old.etapa) then
    insert into public.etapa_historico (lead_id, etapa, entrou_em)
    values (new.id, new.etapa, now());
  end if;
  return new;
end;
$$;

create trigger leads_registrar_etapa_historico
  after insert or update on public.leads
  for each row
  execute function public.registrar_etapa_historico();

-- Backfill: leads existentes ganham 1 entrada no histórico com a etapa atual,
-- pra não ficarem de fora do cálculo de tempo médio.
insert into public.etapa_historico (lead_id, etapa, entrou_em)
select id, etapa, created_at from public.leads;
