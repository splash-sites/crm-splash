-- Restringe faixa_preco a uma lista fechada de faixas.
alter table public.leads
  add constraint leads_faixa_preco_check
  check (faixa_preco in (
    'ate_150k',
    '150k_300k',
    '300k_500k',
    '500k_750k',
    '750k_1m',
    '1m_1_5m',
    '1_5m_2m',
    '2m_3m',
    '3m_5m',
    '5m_10m',
    'acima_10m'
  ));
