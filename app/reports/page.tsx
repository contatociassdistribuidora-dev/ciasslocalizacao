"use client";

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { exportCsv, exportExcel, exportPdf } from '@/lib/reporting';
import { getReportRows } from '@/src/services/reports';

export default function ReportsPage() {
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getReportRows();
        setRows(data ?? []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <AppShell>
      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="mt-1 text-sm text-slate-500">Gere relatórios filtrados e exporte em Excel, CSV e PDF.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => exportCsv(rows)} className="rounded-full bg-sky-500 px-4 py-2.5 font-medium text-white">Exportar CSV</button>
          <button onClick={() => exportExcel(rows)} className="rounded-full border border-slate-300 px-4 py-2.5 font-medium">Exportar Excel</button>
          <button onClick={() => exportPdf(rows)} className="rounded-full border border-slate-300 px-4 py-2.5 font-medium">Exportar PDF</button>
        </div>

        {loading ? <p className="mt-6 text-sm text-slate-500">Carregando relatório...</p> : null}

        <div className="mt-8 max-w-full overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[42rem] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Responsável</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={String(row.id)} className="border-t border-slate-200">
                  <td className="px-4 py-3">{String(row.name ?? '')}</td>
                  <td className="px-4 py-3">{String(row.document_number ?? '')}</td>
                  <td className="px-4 py-3">{String(row.city ?? '')}</td>
                  <td className="px-4 py-3">{String(row.created_by ?? '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
