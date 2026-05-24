-- Importação gerada a partir de controle_vencimentos_conselhos_fnde_moderno.xlsx
-- Atualiza INEPs e cadastra mandatos de conselho para unidades reconhecidas.
-- Total importável: 49

update public.school_units
set inep = '52095070'
where name = 'Escola M. Acelina Alves de Araújo';

update public.school_units
set inep = '52095061'
where name = 'Escola M. Ana Lúcia Oliveira da Silva';

update public.school_units
set inep = '52286355'
where name = 'Escola M. Antônio Cícero Araújo da Costa';

update public.school_units
set inep = '52071553'
where name = 'Escola Municipal Antônio de Jesus Leite';

update public.school_units
set inep = '52085929'
where name = 'Escola Municipal Antônio Luiz Gonzaga';

update public.school_units
set inep = '52051285'
where name = 'Escola Municipal Camargo II';

update public.school_units
set inep = '52227359'
where name = 'CEMEI - Centro Municipal de Educação Inclusiva';

update public.school_units
set inep = '52101843'
where name = 'Creche M. Dona Mª Pires Perillo';

update public.school_units
set inep = '52100642'
where name = 'Creche M. Indiara Carneiro Machado Lisboa';

update public.school_units
set inep = '52227367'
where name = 'Creche M. Mundo Encantado';

update public.school_units
set inep = '52109720'
where name = 'Creche Municipal Prof. Fátima Enes Muniz';

update public.school_units
set inep = '52109518'
where name = 'Creche Municipal Profª. Vilma Maria da Costa Araújo';

update public.school_units
set inep = '52051170'
where name = 'Escola Municipal Darci Ribeiro';

update public.school_units
set inep = '52051463'
where name = 'Escola M. Domingos Simão de Oliveira';

update public.school_units
set inep = '52051382'
where name = 'Escola Municipal Edinaldo Pereira';

update public.school_units
set inep = '52081869'
where name = 'Escola M. Ednalda Guedes de Souza';

update public.school_units
set inep = '52088790'
where name = 'Escola M. Ednalva Valdevino dos Santos';

update public.school_units
set inep = '52070476'
where name = 'Escola M. Emília Ferreira de Souza';

update public.school_units
set inep = '52091090'
where name = 'Escola Municipal Erotides Dias da Costa';

update public.school_units
set inep = '52098320'
where name = 'Escola M. Fernando Cunha Junior';

update public.school_units
set inep = '52070468'
where name = 'Escola M. Francisca Ferreira da Silva';

update public.school_units
set inep = '52095053'
where name = 'Escola M. Geracina Pereira da Silva';

update public.school_units
set inep = '52283380'
where name = 'Escola M. Inácio Carneiro da Costa';

update public.school_units
set inep = '52078566'
where name = 'Escola Municipal Jardim das Oliveiras';

update public.school_units
set inep = '52085937'
where name = 'Escola M. João Elízio Lima Pessoa';

update public.school_units
set inep = '52071561'
where name = 'Escola M. Joaquim Pedro Gomes da Cruz';

update public.school_units
set inep = '52078531'
where name = 'Escola M. José A. de Araújo - Zé Chevrolet';

update public.school_units
set inep = '52051471'
where name = 'Escola Municipal José Vitorino de Souza';

update public.school_units
set inep = '52095860'
where name = 'Escola Municipal Juliana Eloy da Silva';

update public.school_units
set inep = '52092615'
where name = 'Escola Municipal Luiza Tereza';

update public.school_units
set inep = '52078582'
where name = 'Escola Municipal Maria de Fátima Alves';

update public.school_units
set inep = '52099296'
where name = 'Escola M. Maria do Livramento Felipe';

update public.school_units
set inep = '52097293'
where name = 'Escola Municipal Maria José Costa Lima';

update public.school_units
set inep = '52285359'
where name = 'Escola M. Maria Machado de Matos';

update public.school_units
set inep = '52051544'
where name = 'Escola Municipal Maristela Regina Neris';

update public.school_units
set inep = '52051145'
where name = 'Escola Municipal MEG-LUZ';

update public.school_units
set inep = '52284379'
where name = 'Escola Municipal Mestre Zezito';

update public.school_units
set inep = '52070450'
where name = 'Escola Municipal Milena Barbosa Gama';

update public.school_units
set inep = '52091082'
where name = 'Escola M. Nilzon Periquito de Lima';

update public.school_units
set inep = '52095045'
where name = 'Escola M. Orlando Soares de Sousa';

update public.school_units
set inep = '52051552'
where name = 'Escola M. P. Edileuza de A. Cavalcante';

update public.school_units
set inep = '52078540'
where name = 'Escola M. Profª. Erika Flávia Vieira de Souza';

update public.school_units
set inep = '52095150'
where name = 'Escola Municipal Roberto Alves da Silva';

update public.school_units
set inep = '52078574'
where name = 'Escola Municipal Rui Barbosa';

update public.school_units
set inep = '52078558'
where name = 'Escola Municipal São Bartolomeu';

update public.school_units
set inep = '52284352'
where name = 'Escola M. Senador Emival Ramos Caiado';

update public.school_units
set inep = '52051560'
where name = 'Escola M. Vereador Érico Souza Ferreira';

update public.school_units
set inep = '52051510'
where name = 'Escola M. Vicente de Paula Lisboa';

update public.school_units
set inep = '52283399'
where name = 'Escola Municipal Zélia Correa Cotrim';

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-09-16', '2027-09-16', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Acelina Alves Araújo. CNPJ: 08.715.232/0001-38. Dias para vencer: Sun Apr 28 1901 20:53:32 GMT-0306 (Horário Padrão de Brasília). Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Acelina Alves de Araújo'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-09-16'
    and c.mandate_end = '2027-09-16'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-11-10', '2026-11-10', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Ana Lúcia O. da Silva. CNPJ: 08.715.249/0001-95. Dias para vencer: 175. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Ana Lúcia Oliveira da Silva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-11-10'
    and c.mandate_end = '2026-11-10'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-02-27', '2027-02-27', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Antônio Cícero Araujo da Costa. CNPJ: 13.833.403/0001-63. Dias para vencer: 284. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Antônio Cícero Araújo da Costa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-02-27'
    and c.mandate_end = '2027-02-27'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-10-09', '2026-10-09', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Antonio de Jesus Leite. CNPJ: 01.932.619/0001-05. Dias para vencer: 143. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Antônio de Jesus Leite'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-10-09'
    and c.mandate_end = '2026-10-09'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-21', '2026-09-21', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Antônio Luiz Gonzaga. CNPJ: 07.447.574/0001-51. Dias para vencer: 125. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Antônio Luiz Gonzaga'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-21'
    and c.mandate_end = '2026-09-21'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-06-05', '2026-06-05', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Camargo II. CNPJ: 02.966.350/0001-32. Dias para vencer: 17. Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Camargo II'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-06-05'
    and c.mandate_end = '2026-06-05'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-05-05', '2025-05-05', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: CEMEI. CNPJ: 11.481.695/0001-97. Dias para vencer: -379. Situação original: Vencido. Mapeamento: manual.'
from public.school_units
where name = 'CEMEI - Centro Municipal de Educação Inclusiva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-05-05'
    and c.mandate_end = '2025-05-05'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-06-29', '2027-06-29', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: Creche M. Dona Maria Pires Perillo. CNPJ: 30.843.644/0001-02. Dias para vencer: 406. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Creche M. Dona Mª Pires Perillo'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-06-29'
    and c.mandate_end = '2027-06-29'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-03-15', '2027-03-15', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: Creche M. Indiara (Santa Lúcia). CNPJ: 22.770.458/0001-62. Dias para vencer: 300. Situação original: Vigente. Mapeamento: manual.'
from public.school_units
where name = 'Creche M. Indiara Carneiro Machado Lisboa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-03-15'
    and c.mandate_end = '2027-03-15'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-10-22', '2026-10-22', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: Creche Municipal Mundo Encantado. CNPJ: 13.833.391/0001-77. Dias para vencer: 156. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Creche M. Mundo Encantado'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-10-22'
    and c.mandate_end = '2026-10-22'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-05-17', '2027-05-17', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: Creche Municipal Prof. Fátima Enes Muniz. CNPJ: 55.723.297/0001-05. Dias para vencer: 363. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Creche Municipal Prof. Fátima Enes Muniz'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-05-17'
    and c.mandate_end = '2027-05-17'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-05-03', '2027-05-03', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: Creche M. Vilma de Maria Costa Araujo. CNPJ: 55.191.905/0001-88. Dias para vencer: 349. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Creche Municipal Profª. Vilma Maria da Costa Araújo'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-05-03'
    and c.mandate_end = '2027-05-03'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-10', '2026-03-09', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Darci Ribeiro. CNPJ: 01.932.625/0001-54. Dias para vencer: -71. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Darci Ribeiro'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-10'
    and c.mandate_end = '2026-03-09'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-23', '2026-03-23', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Domingos Simão de Oliveira. CNPJ: 01.932.609/0001-61. Dias para vencer: -57. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Domingos Simão de Oliveira'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-23'
    and c.mandate_end = '2026-03-23'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-04-26', '2027-04-26', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. EDINALDO PEREIRA. CNPJ: 01.932.628/0001-98. Dias para vencer: 342. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Edinaldo Pereira'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-04-26'
    and c.mandate_end = '2027-04-26'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-24', '2026-03-24', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Ednalda G. de Sousa. CNPJ: 03.827.690/0001-45. Dias para vencer: -56. Situação original: Vencido. Mapeamento: manual.'
from public.school_units
where name = 'Escola M. Ednalda Guedes de Souza'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-24'
    and c.mandate_end = '2026-03-24'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-03-04', '2027-03-04', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Ednalva Valdevino dos Santos. CNPJ: 05.906.223/0001-36. Dias para vencer: 289. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Ednalva Valdevino dos Santos'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-03-04'
    and c.mandate_end = '2027-03-04'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-03-15', '2027-03-15', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Emília Ferreira. CNPJ: 01.932.606/0001-28. Dias para vencer: 300. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Emília Ferreira de Souza'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-03-15'
    and c.mandate_end = '2027-03-15'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-06-21', '2027-06-21', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Erotides Dias Costa. CNPJ: 09.010.217/0001-57. Dias para vencer: 398. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Erotides Dias da Costa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-06-21'
    and c.mandate_end = '2027-06-21'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-06-07', '2026-06-07', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Fernando Cunha Júnior. CNPJ: 19.158.844/0001-93. Dias para vencer: 19. Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Fernando Cunha Junior'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-06-07'
    and c.mandate_end = '2026-06-07'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-10-25', '2026-10-25', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Francisca Ferreira da Silva. CNPJ: 01.932.614/0001-74. Dias para vencer: 159. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Francisca Ferreira da Silva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-10-25'
    and c.mandate_end = '2026-10-25'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-31', '2026-03-31', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Geracina P. da Silva. CNPJ: 09.010.291/0001-73. Dias para vencer: -49. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Geracina Pereira da Silva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-31'
    and c.mandate_end = '2026-03-31'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-10-18', '2026-10-18', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Inácio Carneiro da Costa. CNPJ: 14.526.930/0001-98. Dias para vencer: 152. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Inácio Carneiro da Costa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-10-18'
    and c.mandate_end = '2026-10-18'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-02-15', '2026-02-14', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Jardim das Oliveiras. CNPJ: 03.818.921/0001-54. Dias para vencer: -94. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Jardim das Oliveiras'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-02-15'
    and c.mandate_end = '2026-02-14'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-06-21', '2027-06-21', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. João Elizio Lima Pessoa. CNPJ: 04.696.087/0001-34. Dias para vencer: 398. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. João Elízio Lima Pessoa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-06-21'
    and c.mandate_end = '2027-06-21'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-15', '2026-03-15', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Joaquim Pedro Gomes da Cruz. CNPJ: 01.932.621/0001-76. Dias para vencer: -65. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Joaquim Pedro Gomes da Cruz'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-15'
    and c.mandate_end = '2026-03-15'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-05', '2026-09-05', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. José Alves De Araujo - Zé Chevrolet. CNPJ: 03.827.731/0001-01. Dias para vencer: 109. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. José A. de Araújo - Zé Chevrolet'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-05'
    and c.mandate_end = '2026-09-05'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-20', '2026-09-20', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. José Vitorino de Souza. CNPJ: 01.932.612/0001-85. Dias para vencer: 124. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal José Vitorino de Souza'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-20'
    and c.mandate_end = '2026-09-20'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-04-28', '2026-04-28', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Juliana Eloy da Silva. CNPJ: 14.526.903/0001-15. Dias para vencer: -21. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Juliana Eloy da Silva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-04-28'
    and c.mandate_end = '2026-04-28'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-02-27', '2026-02-27', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Luiza Tereza. CNPJ: 08.715.242/0001-73. Dias para vencer: -81. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Luiza Tereza'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-02-27'
    and c.mandate_end = '2026-02-27'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-04-10', '2026-04-10', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Maria de Fatima Alves. CNPJ: 03.818.961/0001-04. Dias para vencer: -39. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Maria de Fátima Alves'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-04-10'
    and c.mandate_end = '2026-04-10'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-02-22', '2027-02-22', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Maria do Livramento Felipe. CNPJ: 19.422.941/0001-41. Dias para vencer: 279. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Maria do Livramento Felipe'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-02-22'
    and c.mandate_end = '2027-02-22'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-06-23', '2026-06-23', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Prof. Maria José Costa Lima. CNPJ: 19.047.947/0001-86. Dias para vencer: Fri Feb 02 1900 20:53:32 GMT-0306 (Horário Padrão de Brasília). Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Maria José Costa Lima'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-06-23'
    and c.mandate_end = '2026-06-23'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-13', '2026-03-13', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Maria Machado de Matos. CNPJ: 13.833.377/0001-73. Dias para vencer: -67. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Maria Machado de Matos'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-13'
    and c.mandate_end = '2026-03-13'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-24', '2026-03-24', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Maristela Regina Neris. CNPJ: 01.932.627/0001-43. Dias para vencer: -56. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Maristela Regina Neris'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-24'
    and c.mandate_end = '2026-03-24'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-11-17', '2026-11-17', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Meg-Luz. CNPJ: 01.932.624/0001-00. Dias para vencer: 182. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal MEG-LUZ'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-11-17'
    and c.mandate_end = '2026-11-17'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-14', '2026-09-14', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Mestre Zezito. CNPJ: 13.847.766/0001-58. Dias para vencer: 118. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Mestre Zezito'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-14'
    and c.mandate_end = '2026-09-14'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-05', '2026-09-05', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Milena Barbosa Gama. CNPJ: 01.932.618/0001-52. Dias para vencer: 109. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Milena Barbosa Gama'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-05'
    and c.mandate_end = '2026-09-05'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-16', '2026-03-16', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Nilzon Periquito de Lima. CNPJ: 07.420.118/0001-18. Dias para vencer: -64. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Nilzon Periquito de Lima'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-16'
    and c.mandate_end = '2026-03-16'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-08-17', '2026-08-17', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Prof. Orlando Soares de Sousa. CNPJ: 09.010.242/0001-30. Dias para vencer: 90. Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Orlando Soares de Sousa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-08-17'
    and c.mandate_end = '2026-08-17'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-09-05', '2026-09-05', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Profª Edileuza de Azevedo Cavalcante. CNPJ: 01.932.616/0001-63. Dias para vencer: 109. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. P. Edileuza de A. Cavalcante'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-09-05'
    and c.mandate_end = '2026-09-05'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-09', '2026-03-09', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Profª Érica Flávia V. de Sousa. CNPJ: 03.818.946/0001-58. Dias para vencer: -71. Situação original: Vencido. Mapeamento: manual.'
from public.school_units
where name = 'Escola M. Profª. Erika Flávia Vieira de Souza'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-09'
    and c.mandate_end = '2026-03-09'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-28', '2026-03-28', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Roberto Alves da Silva. CNPJ: 08.715.219/0001-89. Dias para vencer: -52. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Roberto Alves da Silva'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-28'
    and c.mandate_end = '2026-03-28'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2024-02-22', '2027-02-22', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Rui Barbosa. CNPJ: 03.818.939/0001-56. Dias para vencer: 279. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Rui Barbosa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2024-02-22'
    and c.mandate_end = '2027-02-22'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-31', '2026-03-31', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Prof. Inivaldo Guedes da Silva (São Bartolomeu). CNPJ: 02.987.991/0001-73. Dias para vencer: -49. Situação original: Vencido. Mapeamento: manual.'
from public.school_units
where name = 'Escola Municipal São Bartolomeu'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-31'
    and c.mandate_end = '2026-03-31'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-07-03', '2026-07-03', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Senador Emival Ramos Caiado. CNPJ: 12.614.288/0001-73. Dias para vencer: 45. Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Senador Emival Ramos Caiado'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-07-03'
    and c.mandate_end = '2026-07-03'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-11-13', '2026-11-12', 0, 'regular', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Vereador Erico Souza Ferreira. CNPJ: 01.932.611/0001-30. Dias para vencer: 177. Situação original: Vigente. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Vereador Érico Souza Ferreira'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-11-13'
    and c.mandate_end = '2026-11-12'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-03-15', '2026-03-15', 0, 'vencido', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Vicente de Paula. CNPJ: 01.932.605/0001-83. Dias para vencer: -65. Situação original: Vencido. Mapeamento: automatico.'
from public.school_units
where name = 'Escola M. Vicente de Paula Lisboa'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-03-15'
    and c.mandate_end = '2026-03-15'
);

insert into public.school_councils (school_unit_id, president_name, vice_president_name, mandate_start, mandate_end, members_count, status, notes)
select id, 'Não informado', null, '2023-05-29', '2026-05-29', 0, 'atencao', 'Importado da planilha de controle de conselhos. Escola no arquivo: E.M. Zélia Correa Cotrim. CNPJ: 13.833.418/0001-21. Dias para vencer: 10. Situação original: Vence em até 90 dias. Mapeamento: automatico.'
from public.school_units
where name = 'Escola Municipal Zélia Correa Cotrim'
and not exists (
  select 1 from public.school_councils c
  where c.school_unit_id = public.school_units.id
    and c.mandate_start = '2023-05-29'
    and c.mandate_end = '2026-05-29'
);
