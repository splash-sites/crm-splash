-- Faixa de horário que a agenda de visitas exibe, configurável por corretor.
alter table public.perfis
  add column horario_inicio smallint not null default 7,
  add column horario_fim smallint not null default 20,
  add constraint perfis_horario_valido check (
    horario_inicio >= 0 and horario_inicio <= 23
    and horario_fim >= 0 and horario_fim <= 23
    and horario_inicio < horario_fim
  );
