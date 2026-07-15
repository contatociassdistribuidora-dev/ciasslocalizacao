"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { getLocations, type LocationRecord } from '@/src/services/locations';

export default function LocationsPage() {
  const [items, setItems] = useState<LocationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getLocations();
        setItems(data);
      } catch (err) {
        setError('Não foi possível carregar as localizações.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AppShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Localizações</h1>
            <p className="mt-1 text-sm text-slate-500">Pesquise, filtre e visualize os registros cadastrados.</p>
          </div>
          <Link href="/locations/new" className="rounded-full bg-sky-500 px-4 py-2.5 font-medium text-white">
            Novo cadastro
          </Link>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-500">Carregando localizações...</p> : null}
        {error ? <p className="mt-6 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{item.name}</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{item.status === 'inactive' ? 'Inativo' : 'Ativo'}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{[item.address, item.neighborhood, item.city].filter(Boolean).join(' - ') || 'Endereço não informado'}</p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-full border border-slate-300 px-3 py-2 text-sm">Visualizar</button>
                <button className="rounded-full border border-slate-300 px-3 py-2 text-sm">Editar</button>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && items.length === 0 ? <p className="mt-6 text-sm text-slate-500">Nenhuma localização encontrada.</p> : null}
      </div>
    </AppShell>
  );
}
