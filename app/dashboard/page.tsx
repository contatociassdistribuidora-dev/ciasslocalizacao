"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { OfflineBanner } from '@/components/offline-banner';
import { getLocations } from '@/src/services/locations';

const LocationMap = dynamic(() => import('@/components/location-map').then((mod) => mod.LocationMap), {
  ssr: false,
  loading: () => <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500">Carregando mapa...</div>,
});

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, today: 0, month: 0 });

  useEffect(() => {
    async function load() {
      const data = await getLocations();
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const filtered = data.filter((item) => item.created_at);
      setStats({
        total: filtered.length,
        active: filtered.filter((item) => item.status === 'active').length,
        inactive: filtered.filter((item) => item.status === 'inactive').length,
        today: filtered.filter((item) => item.created_at && new Date(item.created_at) >= new Date(today.toDateString())).length,
        month: filtered.filter((item) => item.created_at && new Date(item.created_at) >= monthStart).length,
      });
    }

    load();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <OfflineBanner />
        <section className="grid gap-4 md:grid-cols-5">
          {[
            ['Total', stats.total],
            ['Ativas', stats.active],
            ['Inativas', stats.inactive],
            ['Hoje', stats.today],
            ['Mês', stats.month],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section id="mapa" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <h2 className="text-xl font-semibold">Mapa resumido</h2>
          <p className="mt-2 text-sm text-slate-500">Os pontos cadastrados aparecem em um mapa interativo com Leaflet.</p>
          <div className="mt-4">
            <LocationMap />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
