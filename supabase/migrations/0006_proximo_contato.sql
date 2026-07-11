-- Padrão de dias até o próximo contato, por corretor.
-- Sem tela de configuração ainda (fica pra feature 9) — usado como valor
-- inicial ao cadastrar um lead novo.
alter table public.perfis
  add column dias_para_contato_padrao integer not null default 3;

-- Intervalo configurável por lead + data calculada do próximo contato.
alter table public.leads
  add column dias_para_contato integer not null default 3,
  add column proximo_contato_em timestamptz not null default now();

create index leads_proximo_contato_em_idx on public.leads (proximo_contato_em);
