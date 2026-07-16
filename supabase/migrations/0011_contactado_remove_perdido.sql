-- Etapa "perdido" sai do funil; "contactado" entra antes de "qualificando".
update public.leads set etapa = 'fechado' where etapa = 'perdido';

alter table public.leads
  drop constraint leads_etapa_check;

alter table public.leads
  add constraint leads_etapa_check
    check (etapa in ('novo', 'contactado', 'qualificando', 'proposta', 'negociacao', 'fechado'));
