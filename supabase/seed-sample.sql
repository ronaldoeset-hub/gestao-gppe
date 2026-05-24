insert into public.resource_transfers (school_unit_id, program, source, amount, released_at, balance, status)
select id, 'PDDE Básico', 'FNDE', 42850.00, '2026-02-12', 12840.00, 'regular'
from public.school_units
where name = 'Escola M. Acelina Alves de Araújo'
on conflict do nothing;

insert into public.resource_transfers (school_unit_id, program, source, amount, released_at, balance, status)
select id, 'Educação Conectada', 'FNDE', 18900.00, '2026-03-20', 18900.00, 'pendente'
from public.school_units
where name = 'Creche Municipal Eliene Martins Braga'
on conflict do nothing;

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status)
select id, 'Presidente do Conselho', 'Vice-presidente do Conselho', '2025-01-01', '2027-12-31', 9, 'regular'
from public.school_units
where name = 'Escola M. Acelina Alves de Araújo'
on conflict do nothing;

insert into public.accountabilities (school_unit_id, reference_period, due_date, submitted_at, status, technical_opinion)
select id, '1º quadrimestre de 2026', '2026-05-30', null, 'pendente', null
from public.school_units
where name = 'Creche Municipal Eliene Martins Braga'
on conflict do nothing;

insert into public.alerts (title, description, severity, due_date)
values
  ('Prestação próxima do prazo', 'Unidades possuem prestação de contas com vencimento nos próximos dias.', 'alta', '2026-05-30'),
  ('Mandatos de conselho a renovar', 'Conselhos escolares encerram mandato neste semestre.', 'media', '2026-06-15')
on conflict do nothing;
