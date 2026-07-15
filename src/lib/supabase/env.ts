const CONFIG_ERROR = 'Variáveis do Supabase não configuradas corretamente.';

export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  const issues: string[] = [];
  let hostname = '';

  try {
    const parsed = new URL(url);
    hostname = parsed.hostname;
    if (parsed.protocol !== 'https:') issues.push('a URL deve começar com https://');
    if (parsed.username || parsed.password || parsed.search || parsed.hash) issues.push('a URL contém componentes inesperados');
    if (parsed.pathname !== '/' && parsed.pathname !== '') issues.push('a URL não deve conter caminhos');
    if (hostname === 'supabase.com' || hostname === 'www.supabase.com') issues.push('use a URL do projeto, não a URL do dashboard');
  } catch { issues.push('a URL é inválida'); }

  const normalizedUrl = url.toLowerCase();
  if (!url || /\s/.test(url)) issues.push('a URL está ausente ou contém espaços');
  if (normalizedUrl.includes('example.supabase.co') || normalizedUrl.includes('placeholder')) issues.push('a URL contém placeholder');
  if (!anonKey || /placeholder|your[_-]|changeme/i.test(anonKey)) issues.push('a chave pública está ausente ou contém placeholder');

  if (issues.length) {
    if (process.env.NODE_ENV === 'development') console.error('[supabase] Configuração pública inválida.', { issues });
    throw new Error(CONFIG_ERROR);
  }
  return { url, anonKey, hostname };
}

export function getAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) try { return new URL(configured).origin; } catch { /* usa a origem atual */ }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function getAuthErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  const message = raw.toLowerCase();
  if (raw === CONFIG_ERROR) return CONFIG_ERROR;
  if (/credenciais inválidas|e-mail não confirmado|usuário inativo|erro de rede ao tentar autenticar/.test(message)) return raw;
  if (/failed to fetch|fetch failed|networkerror|network request failed|load failed/.test(message)) return 'Erro de rede ao tentar autenticar. Não foi possível conectar ao Supabase; verifique a URL, a conexão, o DNS e se o projeto está ativo.';
  if (/invalid login credentials|invalid_grant|user not found/.test(message)) return 'Credenciais inválidas.';
  if (/email not confirmed/.test(message)) return 'E-mail não confirmado.';
  if (/inactive|banned/.test(message)) return 'Usuário inativo.';
  if (/row-level security|permission denied|policy/.test(message)) return 'Não foi possível carregar o perfil. Verifique as políticas RLS do Supabase.';
  return 'Não foi possível concluir a autenticação. Tente novamente.';
}

export function devSupabaseLog(event: string, details: Record<string, string | number | boolean | null> = {}) {
  if (process.env.NODE_ENV === 'development') console.info(`[supabase] ${event}`, details);
}
