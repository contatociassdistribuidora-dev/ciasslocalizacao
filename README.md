# Cadastro de Localizações

Aplicação Next.js 14 com Supabase Auth, perfis protegidos por RLS e suporte PWA.

## Configuração

Copie `.env.example` para `.env.local` e substitua todos os placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-pública>
SUPABASE_SERVICE_ROLE_KEY=<service-role-somente-servidor>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Use em produção a origem pública correspondente em `NEXT_PUBLIC_APP_URL`. Nunca envie `.env.local` ao Git. A service role é opcional para autenticação comum e nunca pode ser usada no navegador.

```powershell
npm install
npm run dev
```

## Erro TypeError: Failed to fetch no login

1. Copie a URL exata de **Supabase → Project Settings → API** para `NEXT_PUBLIC_SUPABASE_URL`. Ela contém o project ref; o nome da aplicação não substitui esse identificador.
2. Confirme `NEXT_PUBLIC_SUPABASE_ANON_KEY` e remova placeholders.
3. Reinicie o servidor depois de alterar `.env.local`:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

4. Verifique se o projeto Supabase está ativo e se o domínio resolve no DNS.
5. Em Chrome DevTools, confira **Network** e a chamada para `/auth/v1/token`.
6. Vá a **Application → Service Workers → Unregister**.
7. Depois use **Application → Storage → Clear site data**.
8. Confirme que o usuário existe, tem e-mail confirmado e possui uma linha em `public.profiles` com o mesmo `id` e `active = true`.

O service worker ignora completamente `*.supabase.co`; autenticação, REST e Storage nunca são armazenados em cache. Em desenvolvimento, os logs mostram somente eventos, domínio e status sanitizado — nunca senhas, chaves ou tokens.

## Banco de dados e RLS

Aplique as migrations de `supabase/migrations` em ordem. A migration `009_harden_profiles_rls.sql` permite ao usuário autenticado ler o próprio perfil (`auth.uid() = id`) e mantém a verificação administrativa em função `security definer` com `search_path` restrito, sem recursão de policies.

## Verificações

```powershell
npm run lint
npm run typecheck
npm run build
```
