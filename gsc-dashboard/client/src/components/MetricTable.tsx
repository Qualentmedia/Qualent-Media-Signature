import { useState } from 'react';
import { ArrowUpDown, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useSort } from '../lib/useSort';
import { fmtInt, fmtPct, fmtPos } from '../lib/format';

export interface MetricRow {
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

type SortKey = keyof Omit<MetricRow, 'name'> | 'name';

const COLUMNS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'name', label: '', align: 'left' },
  { key: 'clicks', label: 'Clicks', align: 'right' },
  { key: 'impressions', label: 'Impressions', align: 'right' },
  { key: 'ctr', label: 'CTR', align: 'right' },
  { key: 'position', label: 'Position', align: 'right' },
];

interface Props {
  rows: MetricRow[];
  nameHeader: string;
  searchPlaceholder: string;
}

export function MetricTable({ rows, nameHeader, searchPlaceholder }: Props) {
  const [q, setQ] = useState('');
  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const { sorted, key, dir, toggle } = useSort<MetricRow>(filtered, 'clicks', 'desc');
  const maxClicks = Math.max(...rows.map((r) => r.clicks), 1);

  const SortIcon = ({ k }: { k: SortKey }) =>
    key === k ? (
      dir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />
    ) : (
      <ArrowUpDown size={13} className="opacity-30" />
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <Search size={16} className="text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 text-sm focus:outline-none bg-transparent text-slate-700"
        />
        <span className="text-xs text-slate-400">{filtered.length} rows</span>
      </div>
      <div className="overflow-x-auto max-h-[calc(100vh-22rem)] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggle(c.key as keyof MetricRow)}
                  className={`px-4 py-3 font-semibold cursor-pointer select-none whitespace-nowrap ${
                    c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className={`inline-flex items-center gap-1 ${c.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {c.key === 'name' ? nameHeader : c.label}
                    <SortIcon k={c.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((r) => (
              <tr key={r.name} className="hover:bg-slate-50">
                <td className="px-4 py-2.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 rounded-full bg-blue-500/80" style={{ width: `${(r.clicks / maxClicks) * 60 + 4}px` }} />
                    <span className="truncate text-slate-700" title={r.name}>{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-900">{fmtInt(r.clicks)}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{fmtInt(r.impressions)}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{fmtPct(r.ctr)}</td>
                <td className="px-4 py-2.5 text-right text-slate-600">{fmtPos(r.position)}</td>
              </tr>
            ))}
            {!sorted.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">No matching rows</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
