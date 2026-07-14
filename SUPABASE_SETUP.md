# Configuração do Supabase

1. Crie um projeto no Supabase.
2. Ative o Auth com e-mail/senha.
3. Crie o bucket `location-photos` com políticas públicas de leitura e autenticação para escrita.
4. Execute a migration em `supabase/migrations/001_init.sql`.
5. Copie `.env.example` para `.env.local` e preencha as chaves.
6. Crie o primeiro usuário administrador no Auth e atualize o perfil em `profiles` com `role = 'admin'`.
7. Para o deploy na Vercel, defina as mesmas variáveis de ambiente no painel do projeto.
