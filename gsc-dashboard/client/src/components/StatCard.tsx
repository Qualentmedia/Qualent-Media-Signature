import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { fmtDelta } from '../lib/format';

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  delta?: number; // pct change vs previous period
  accent?: string;
  highlight?: boolean;
  invertDelta?: boolean; // for "position", lower is better
}

export function StatCard({ label, value, icon, delta, accent = '#2563eb', highlight, invertDelta }: Props) {
  const showDelta = delta !== undefined && Number.isFinite(delta);
  const good = invertDelta ? (delta ?? 0) < 0 : (delta ?? 0) >= 0;
  return (
    <div
      className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${
        highlight ? 'border-blue-300 ring-1 ring-blue-200' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className="p-2 rounded-lg" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </span>
      </div>
      <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
      {showDelta && (
        <div className={`flex items-center gap-1 text-sm font-medium ${good ? 'text-emerald-600' : 'text-rose-600'}`}>
          {good ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {fmtDelta(delta!)}
          <span className="text-slate-400 font-normal">vs prev period</span>
        </div>
      )}
    </div>
  );
}
