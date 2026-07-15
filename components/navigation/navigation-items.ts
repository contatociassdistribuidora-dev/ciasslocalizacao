import type { Route } from 'next';
import { FileText, LayoutGrid, Map, MapPinned, PlusCircle, Settings, Users } from 'lucide-react';

export type NavigationRole = 'admin' | 'operator' | 'viewer';

export type NavigationItem = {
  label: string;
  href: Route;
  icon: typeof LayoutGrid;
  roles: NavigationRole[];
  activePath: string;
};

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutGrid, roles: ['admin', 'operator', 'viewer'], activePath: '/dashboard' },
  { label: 'Localizações', href: '/locations', icon: MapPinned, roles: ['admin', 'operator', 'viewer'], activePath: '/locations' },
  { label: 'Nova localização', href: '/locations/new', icon: PlusCircle, roles: ['admin', 'operator'], activePath: '/locations/new' },
  { label: 'Mapa', href: '/dashboard#mapa', icon: Map, roles: ['admin', 'operator', 'viewer'], activePath: '/dashboard#mapa' },
  { label: 'Relatórios', href: '/reports', icon: FileText, roles: ['admin', 'operator', 'viewer'], activePath: '/reports' },
  { label: 'Usuários', href: '/settings#usuarios', icon: Users, roles: ['admin'], activePath: '/settings#usuarios' },
  { label: 'Configurações', href: '/settings', icon: Settings, roles: ['admin'], activePath: '/settings' },
];

export function getNavigationItems(role?: NavigationRole | null) {
  return role ? navigationItems.filter((item) => item.roles.includes(role)) : [];
}
