-- Pivô de produto: de CRM para corretores de imóveis autônomos para CRM
-- interno de captação de leads da Splash Sistemas. Dados de teste do domínio
-- antigo (imóveis) não têm valor pro domínio novo — descartados aqui.
truncate table public.leads cascade;

-- Bairro de interesse era específico de imóvel. Sai de escopo.
drop table public.lead_bairros;
drop table public.bairros;

-- ============================================================
-- leads: campos de imóvel saem, campos de venda B2B de software entram
-- ============================================================
alter table public.leads
  drop constraint leads_tipo_imovel_check,
  drop constraint leads_finalidade_check,
  drop constraint leads_faixa_preco_check,
  drop constraint leads_origem_check,
  drop constraint leads_etapa_check;

alter table public.leads
  drop column tipo_imovel,
  drop column finalidade,
  drop column faixa_preco;

alter table public.leads
  rename column nome to nome_contato;

alter table public.leads
  add column nome_empresa text not null default '',
  add column produto_interesse text check (produto_interesse in ('software', 'landing_page')),
  add column ticket_estimado numeric;

alter table public.leads
  alter column nome_empresa drop default;

alter table public.leads
  add constraint leads_origem_check
    check (origem in ('instagram', 'indicacao', 'whatsapp', 'prospeccao')),
  add constraint leads_etapa_check
    check (etapa in ('novo', 'qualificando', 'demo_agendada', 'proposta', 'negociacao', 'fechado', 'perdido'));
