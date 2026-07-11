-- Seed manual (não é migration) — 3 leads de exemplo, todos vencidos,
-- pra ver o painel "Falar hoje" populado. Roda no SQL Editor.
-- Alvo: conta selsopacheco1@gmail.com
do $$
declare
  v_corretor_id uuid;
  v_lead1 uuid;
  v_lead2 uuid;
  v_bairro_centro uuid;
  v_bairro_zona_sul uuid;
begin
  select p.id into v_corretor_id
  from public.perfis p
  join auth.users au on au.id = p.id
  where au.email = 'selsopacheco1@gmail.com';

  insert into public.bairros (corretor_id, nome) values (v_corretor_id, 'Centro')
    on conflict (corretor_id, nome) do update set nome = excluded.nome
    returning id into v_bairro_centro;
  insert into public.bairros (corretor_id, nome) values (v_corretor_id, 'Zona Sul')
    on conflict (corretor_id, nome) do update set nome = excluded.nome
    returning id into v_bairro_zona_sul;

  insert into public.leads
    (corretor_id, nome, telefone, etapa, faixa_preco, dias_para_contato, proximo_contato_em, ultima_interacao, observacoes)
  values
    (v_corretor_id, 'Mariana Costa', '11987654321', 'novo', '300k_500k', 3,
     now() - interval '1 day', now() - interval '4 days',
     'Quer apartamento de 2 quartos perto do metrô, já visitou 2 imóveis na região e ficou interessada em fechar rápido.')
  returning id into v_lead1;

  insert into public.lead_bairros (lead_id, bairro_id)
  values (v_lead1, v_bairro_centro), (v_lead1, v_bairro_zona_sul);

  insert into public.leads
    (corretor_id, nome, telefone, etapa, faixa_preco, dias_para_contato, proximo_contato_em, observacoes)
  values
    (v_corretor_id, 'Carlos Eduardo', '21998877665', 'em_contato', '750k_1m', 5,
     now() - interval '2 hours', 'Procura casa com quintal, flexível na região.')
  returning id into v_lead2;

  insert into public.lead_bairros (lead_id, bairro_id) values (v_lead2, v_bairro_centro);

  insert into public.leads
    (corretor_id, nome, telefone, etapa, faixa_preco, dias_para_contato, proximo_contato_em)
  values
    (v_corretor_id, 'Juliana Alves', '31991234567', 'visita_agendada', '150k_300k', 2,
     now() - interval '3 days');
end $$;
