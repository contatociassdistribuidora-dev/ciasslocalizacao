import { getSupabaseBrowserClient } from '@/src/lib/supabase/client';
import { devSupabaseLog, getAuthErrorMessage } from '@/src/lib/supabase/env';

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseBrowserClient();
  devSupabaseLog('Tentativa de login iniciada.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(getAuthErrorMessage(error));
  devSupabaseLog('Resposta de autenticação recebida.', { authenticated: Boolean(data.user) });
  return data;
}

export async function signOut() {
  const { error } = await getSupabaseBrowserClient().auth.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
}

export async function getSessionUser() {
  const { data: { session } } = await getSupabaseBrowserClient().auth.getSession();
  return session?.user ?? null;
}
