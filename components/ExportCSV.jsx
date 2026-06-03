'use client';

import React from 'react';
import { Download } from 'lucide-react';

export default function ExportCSV({ history }) {
  const handleExport = () => {
    if (!history || history.length === 0) return;

    const headers = 'timestamp,roll,pitch,yaw,ax,ay,az';
    const rows = history.map((entry) =>
      [
        entry.timestamp,
        entry.roll?.toFixed(4) ?? '0.0000',
        entry.pitch?.toFixed(4) ?? '0.0000',
        entry.yaw?.toFixed(4) ?? '0.0000',
        entry.ax?.toFixed(4) ?? '0.0000',
        entry.ay?.toFixed(4) ?? '0.0000',
        entry.az?.toFixed(4) ?? '0.0000',
      ].join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'imu-data-export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const rowCount = history?.length ?? 0;
  const isEmpty = rowCount === 0;

  return (
    <button
      onClick={handleExport}
      disabled={isEmpty}
      className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
        isEmpty
          ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5 text-slate-500'
          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10 hover:text-white hover:shadow-lg hover:shadow-indigo-500/10'
      }`}
    >
      <Download size={14} />
      <span>Export CSV ({rowCount} rows)</span>
    </button>
  );
}
