import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuthErrorMessage, getPublicSupabaseConfig } from './env';

afterEach(() => vi.unstubAllEnvs());

describe('configuração pública do Supabase', () => {
  it('aceita uma URL HTTPS de projeto sem expor a chave', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://project-ref.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'public-test-key');
    expect(getPublicSupabaseConfig().hostname).toBe('project-ref.supabase.co');
  });

  it('rejeita placeholders com uma mensagem segura', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => getPublicSupabaseConfig()).toThrow('Variáveis do Supabase não configuradas corretamente.');
  });
});

describe('mensagens de autenticação', () => {
  it('traduz falha de rede sem incluir detalhes sensíveis', () => {
    expect(getAuthErrorMessage(new TypeError('Failed to fetch'))).toContain('Erro de rede');
  });

  it('traduz credenciais inválidas', () => {
    expect(getAuthErrorMessage(new Error('Invalid login credentials'))).toBe('Credenciais inválidas.');
  });
});
