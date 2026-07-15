import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { devSupabaseLog, getPublicSupabaseConfig } from './env';

let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey, hostname } = getPublicSupabaseConfig();
    browserClient = createBrowserClient(url, anonKey);
    devSupabaseLog('Cliente inicializado.', { hostname });
  }
  return browserClient;
}

export async function checkSupabaseConnection() {
  const { hostname } = getPublicSupabaseConfig();
  devSupabaseLog('Conexão iniciada.', { hostname });
  try {
    const { error } = await getSupabaseBrowserClient().auth.getSession();
    if (error) throw error;
    devSupabaseLog('Conexão concluída.', { hostname, status: 'ok' });
  } catch (error) {
    devSupabaseLog('Erro de conexão.', { hostname, status: error instanceof Error ? error.name : 'erro' });
    throw error;
  }
}
