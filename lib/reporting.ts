import jsPDF from 'jspdf';
import writeXlsxFile from 'write-excel-file/browser';

export function exportCsv(rows: Array<Record<string, unknown>>) {
  const csvContent = [Object.keys(rows[0] ?? {}).join(',')]
    .concat(
      rows.map((row) => Object.values(row).join(','))
    )
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'relatorio.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportExcel(rows: Array<Record<string, unknown>>) {
  const columns = Object.keys(rows[0] ?? {});
  const data = [
    columns.map((column) => ({ value: column, fontWeight: 'bold' as const })),
    ...rows.map((row) => columns.map((column) => ({ value: String(row[column] ?? '') }))),
  ];
  await writeXlsxFile(data, { sheet: 'Relatório' }).toFile('relatorio.xlsx');
}

export function exportPdf(rows: Array<Record<string, unknown>>) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Relatório de Localizações', 14, 18);
  doc.setFontSize(10);
  doc.text(`Registros: ${rows.length}`, 14, 28);

  rows.forEach((row, index) => {
    const y = 40 + index * 12;
    doc.text(`${index + 1}. ${row.name ?? ''}`, 14, y);
  });

  doc.save('relatorio.pdf');
}
