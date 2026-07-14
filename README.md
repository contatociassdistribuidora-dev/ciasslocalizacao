# Cadastro de Localizações

Aplicativo web PWA para cadastro, consulta, mapa e relatórios de localizações, com integração real ao Supabase.

## Funcionalidades
- Autenticação com Supabase Auth
- CRUD de localizações com dados reais
- Upload de fotos para Supabase Storage
- Mapa com Leaflet + OpenStreetMap
- Relatórios em CSV/Excel/PDF
- Estrutura para RLS e auditoria

## Requisitos
- Node.js 18+
- Conta no Supabase
- Variáveis de ambiente configuradas

## Variáveis de ambiente
Copie .env.example para .env.local e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Configuração do Supabase
1. Crie um projeto no Supabase.
2. Ative o Auth com e-mail/senha.
3. Crie o bucket `location-photos` no Storage.
4. Execute o SQL em `supabase/migrations/001_init.sql`.
5. (Opcional) Aplique `supabase/seed.sql` para dados de teste.
6. Crie o primeiro usuário no Auth e, em seguida, insira o perfil correspondente na tabela `profiles` com o campo `role` definido como `admin`.

## Execução local
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Publicação na Vercel
1. Conecte o repositório ao Vercel.
2. Defina as variáveis de ambiente abaixo.
3. Publique o projeto e valide o login, o CRUD e os relatórios.
