-- Seed para testes locais. Substitua pelos dados reais quando configurar o Supabase.
insert into public.profiles (id, full_name, email, role, active)
values (
  '11111111-1111-1111-1111-111111111111',
  'Administrador Demo',
  'admin@demo.local',
  'admin',
  true
)
on conflict (id) do nothing;

insert into public.locations (id, name, document_number, category, address, address_number, neighborhood, city, state, zip_code, latitude, longitude, contact_name, phone, email, notes, status, created_by)
values (
  '22222222-2222-2222-2222-222222222222',
  'Loja Demo',
  '12345678000199',
  'cliente',
  'Rua das Flores',
  '100',
  'Centro',
  'São Paulo',
  'SP',
  '01000-000',
  -23.55052,
  -46.633308,
  'Maria Silva',
  '(11) 99999-0000',
  'contato@demo.local',
  'Cadastro inicial de teste',
  'active',
  '11111111-1111-1111-1111-111111111111'
)
on conflict (id) do nothing;
