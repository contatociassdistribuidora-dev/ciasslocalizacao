"use client";

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutGrid, MapPinned, FileText, Settings, PlusCircle, UserCog } from 'lucide-react';
import { signOut } from '@/lib/auth';

const navItems: Array<{ href: Route; label: string; icon: typeof LayoutGrid }> = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/locations', label: 'Localizações', icon: MapPinned },
  { href: '/reports', label: 'Relatórios', icon: FileText },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-slate-950 p-6 text-white md:flex">
        <div>
          <h2 className="text-2xl font-semibold">Cadastro</h2>
          <p className="mt-2 text-sm text-slate-400">Localizações</p>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ${active ? 'bg-sky-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
          <Link href="/locations/new" className="mt-2 flex items-center gap-3 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white">
            <PlusCircle size={18} />
            Nova localização
          </Link>
        </nav>
        <button onClick={handleSignOut} className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-800 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800">
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <div className="md:ml-64">
        <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">PWA</p>
              <h1 className="text-xl font-semibold">Cadastro de Localizações</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
              <UserCog size={16} />
              Gestão
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
