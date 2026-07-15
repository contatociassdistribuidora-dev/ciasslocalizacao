import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getPublicSupabaseConfig } from './env';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  const { url, anonKey } = getPublicSupabaseConfig();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
        catch { /* Server Components são somente leitura; middleware atualiza a sessão. */ }
      },
    },
  });
}
