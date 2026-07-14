insert into public.profiles (id, full_name, email, role, active)
values (
  '00000000-0000-0000-0000-000000000000',
  'Administrador Inicial',
  'admin@exemplo.com',
  'admin',
  true
)
on conflict (id) do nothing;

insert into public.locations (id, name, document_number, category, address, address_number, neighborhood, city, state, zip_code, latitude, longitude, contact_name, phone, email, notes, status, created_by)
values (
  '11111111-1111-1111-1111-111111111111',
  'Loja Exemplo',
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
  'contato@exemplo.com',
  'Ponto de teste',
  'active',
  '00000000-0000-0000-0000-000000000000'
)
on conflict (id) do nothing;
