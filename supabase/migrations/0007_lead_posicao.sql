-- Ordem manual dos leads dentro de cada etapa (drag and drop de reordenar).
alter table public.leads
  add column posicao double precision not null default 0;

create index leads_posicao_idx on public.leads (posicao);
