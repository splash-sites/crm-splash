-- Coluna substituída pela relação leads <-> bairros (N:N).
alter table public.leads drop column regiao;
