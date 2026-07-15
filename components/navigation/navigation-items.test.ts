import { describe, expect, it } from 'vitest';
import { getNavigationItems } from './navigation-items';

describe('navegação por perfil', () => {
  it('mostra administração somente para admin', () => {
    const labels = getNavigationItems('admin').map((item) => item.label);
    expect(labels).toContain('Usuários');
    expect(labels).toContain('Configurações');
  });

  it('permite cadastro para operator sem mostrar administração', () => {
    const labels = getNavigationItems('operator').map((item) => item.label);
    expect(labels).toContain('Nova localização');
    expect(labels).not.toContain('Usuários');
    expect(labels).not.toContain('Configurações');
  });

  it('mantém viewer apenas em opções de consulta', () => {
    const labels = getNavigationItems('viewer').map((item) => item.label);
    expect(labels).toEqual(['Dashboard', 'Localizações', 'Mapa', 'Relatórios']);
  });

  it('não exibe links enquanto a role ainda não foi validada', () => {
    expect(getNavigationItems()).toEqual([]);
  });
});
