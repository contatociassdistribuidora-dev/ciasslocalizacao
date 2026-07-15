"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, UserCog, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { signOut } from '@/lib/auth';
import { getCurrentProfile, type ProfileRecord } from '@/src/services/profiles';
import { getNavigationItems, type NavigationItem } from '@/components/navigation/navigation-items';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/locations': 'Localizações',
  '/locations/new': 'Nova localização',
  '/reports': 'Relatórios',
  '/settings': 'Configurações',
};

function isItemActive(item: NavigationItem, pathname: string) {
  if (item.activePath.includes('#')) return false;
  if (item.activePath === '/locations') return pathname === '/locations';
  return pathname === item.activePath || pathname.startsWith(`${item.activePath}/`);
}

function NavigationLinks({ items, pathname, onNavigate }: { items: NavigationItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-1.5">
      {items.map((item) => {
        const { href, label, icon: Icon, activePath } = item;
        const active = isItemActive(item, pathname);
        return (
          <Link
            key={activePath}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sky-300 ${active ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <Icon aria-hidden="true" size={19} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function roleLabel(role?: string | null) {
  return role === 'admin' ? 'Administrador' : role === 'operator' ? 'Operador' : role === 'viewer' ? 'Consulta' : 'Carregando';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const items = useMemo(() => getNavigationItems(profile?.role), [profile?.role]);
  const title = pageTitles[pathname] ?? 'Cadastro';

  useEffect(() => {
    let mounted = true;
    getCurrentProfile().then((data) => { if (mounted) setProfile(data); }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  useEffect(() => setDrawerOpen(false), [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    const opener = openButtonRef.current;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
      if (event.key === 'Tab') {
        const drawer = document.getElementById('mobile-navigation');
        const focusable = drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      opener?.focus();
    };
  }, [drawerOpen]);

  async function handleSignOut() {
    setDrawerOpen(false);
    await signOut();
    router.replace('/login');
    router.refresh();
  }

  const identity = profile?.full_name || profile?.email || 'Usuário';

  return (
    <div className="app-viewport bg-slate-100 text-slate-900">
      <aside className="safe-area-y fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto overscroll-contain border-r border-slate-800 bg-slate-950 p-6 text-white lg:flex">
        <div>
          <h2 className="text-2xl font-semibold">Cadastro</h2>
          <p className="mt-1 text-sm text-slate-400">Localizações</p>
        </div>
        <div className="mt-6 border-y border-slate-800 py-4">
          <p className="truncate text-sm font-medium">{identity}</p>
          <p className="mt-1 text-xs text-slate-400">{roleLabel(profile?.role)}</p>
        </div>
        <div className="mt-5 flex-1"><NavigationLinks items={items} pathname={pathname} /></div>
        <button onClick={handleSignOut} className="mt-5 flex min-h-11 items-center gap-3 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300 outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-300">
          <LogOut aria-hidden="true" size={19} /> Sair
        </button>
      </aside>

      <div className="lg:ml-64">
        <header className="safe-area-top sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur lg:hidden">
          <div className="flex min-h-14 items-center gap-3 px-3 safe-area-x sm:px-4">
            <button
              ref={openButtonRef}
              type="button"
              aria-label="Abrir menu de navegação"
              aria-expanded={drawerOpen}
              aria-controls="mobile-navigation"
              onClick={() => setDrawerOpen(true)}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-700 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Menu aria-hidden="true" size={24} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium uppercase tracking-wider text-sky-600">Localizações</p>
              <h1 className="truncate text-base font-semibold">{title}</h1>
            </div>
            <div className="flex min-h-11 max-w-28 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs" aria-label={`Perfil: ${roleLabel(profile?.role)}`}>
              <UserCog aria-hidden="true" className="shrink-0" size={17} />
              <span className="truncate">{roleLabel(profile?.role)}</span>
            </div>
          </div>
        </header>

        <header className="hidden border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur lg:block">
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">PWA</p><h1 className="text-xl font-semibold">{title}</h1></div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><UserCog aria-hidden="true" size={16} />{roleLabel(profile?.role)}</div>
          </div>
        </header>

        <main className="safe-area-x safe-area-bottom min-w-0 p-3 sm:p-5 lg:p-6">{children}</main>
      </div>

      <div className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? '' : 'pointer-events-none invisible'}`} aria-hidden={!drawerOpen}>
        <button type="button" aria-label="Fechar menu" onClick={() => setDrawerOpen(false)} className={`absolute inset-0 bg-slate-950/60 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          className={`mobile-drawer-height safe-area-y absolute inset-y-0 left-0 flex w-[min(86vw,20rem)] flex-col overflow-y-auto overscroll-contain bg-slate-950 p-4 text-white shadow-2xl transition-transform duration-200 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-xl font-semibold">Cadastro</h2><p className="text-sm text-slate-400">Localizações</p></div>
            <button ref={closeButtonRef} type="button" aria-label="Fechar menu de navegação" onClick={() => setDrawerOpen(false)} className="flex size-11 shrink-0 items-center justify-center rounded-xl outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-300"><X aria-hidden="true" size={24} /></button>
          </div>
          <div className="mt-4 rounded-xl border border-slate-800 p-4"><p className="truncate text-sm font-medium">{identity}</p><p className="mt-1 text-xs text-slate-400">{roleLabel(profile?.role)}</p></div>
          <div className="mt-5 flex-1"><NavigationLinks items={items} pathname={pathname} onNavigate={() => setDrawerOpen(false)} /></div>
          <button onClick={handleSignOut} className="mt-5 flex min-h-11 w-full items-center gap-3 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 outline-none hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-300"><LogOut aria-hidden="true" size={19} />Sair</button>
        </aside>
      </div>
    </div>
  );
}
