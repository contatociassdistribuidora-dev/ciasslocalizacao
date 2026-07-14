import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-400">Cadastro de Localizações</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Sistema PWA para gestão completa de localizações</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Gerencie clientes, escolas, depósitos, fornecedores e pontos de entrega com autenticação, mapa, relatórios e armazenamento seguro de fotos.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded-full bg-sky-500 px-6 py-3 font-medium text-white transition hover:bg-sky-400">
              Fazer login
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 font-medium text-slate-100 transition hover:bg-slate-800">
              Abrir dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Autenticação', 'Supabase Auth com perfis admin, operador e consulta.'],
            ['Mapa', 'Leaflet e OpenStreetMap com filtros e detalhes.'],
            ['Relatórios', 'Excel, CSV, PDF e histórico de alterações.'],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
