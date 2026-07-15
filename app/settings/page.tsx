import { AppShell } from '@/components/app-shell';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="mt-1 text-sm text-slate-500">Ajustes de PWA, sincronização offline e segurança.</p>
        <section id="usuarios" className="mt-8 scroll-mt-24 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold">Usuários</h2>
          <p className="mt-1 text-sm text-slate-500">Acesso administrativo aos perfis e permissões do sistema.</p>
        </section>
      </div>
    </AppShell>
  );
}
