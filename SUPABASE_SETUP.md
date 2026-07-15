# Configuração do Supabase

## Variáveis obrigatórias

Obtenha a URL e a chave pública em **Supabase → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-pública>
SUPABASE_SERVICE_ROLE_KEY=<somente se houver operação administrativa server-side>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Cadastre os equivalentes de produção na Vercel, usando a origem pública em `NEXT_PUBLIC_APP_URL`. Não use a service role em componentes client-side.

Execute as migrations de `supabase/migrations` em ordem. Para instalações existentes, aplique ao menos `009_harden_profiles_rls.sql`. Não desative RLS: `profiles_self_access` permite que cada usuário leia somente o próprio perfil, e o acesso administrativo usa uma função não recursiva.

## Erro TypeError: Failed to fetch no login

1. Confirme que `NEXT_PUBLIC_SUPABASE_URL` é a URL exata do projeto, começa com `https://`, termina em `.supabase.co` (ou usa seu domínio customizado) e resolve no DNS.
2. Confirme `NEXT_PUBLIC_SUPABASE_ANON_KEY`; remova `example`, `placeholder` e valores vazios.
3. Confirme que o projeto não está pausado.
4. Reinicie o Next.js após editar `.env.local`:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

5. Em **Chrome DevTools → Network**, inspecione a chamada de autenticação sem copiar tokens.
6. Em **Application → Service Workers**, clique em **Unregister**.
7. Em **Application → Storage**, clique em **Clear site data**.
8. Confirme o usuário no Auth e uma linha em `public.profiles` com o mesmo UUID, `active = true` e role `admin`, `operator` ou `viewer`.

Se o DNS falhar, corrija a URL antes de investigar CORS. Extensões, proxy, firewall e DNS local também podem bloquear o request. O service worker atual não intercepta domínios Supabase.
