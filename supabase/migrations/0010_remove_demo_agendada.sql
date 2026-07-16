-- Demo agendada saiu do funil (Agenda está fora de escopo desde o pivô).
alter table public.leads
  drop constraint leads_etapa_check;

alter table public.leads
  add constraint leads_etapa_check
    check (etapa in ('novo', 'qualificando', 'proposta', 'negociacao', 'fechado', 'perdido'));
