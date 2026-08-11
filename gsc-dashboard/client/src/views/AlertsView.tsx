import { useState } from 'react';
import { BellRing, TrendingDown, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
import { api } from '../api';
import type { Alert, Filters, Severity } from '../types';
import { useAsync } from '../lib/useAsync';
import { Sparkline } from '../components/charts';
import { fmtInt, shortDate } from '../lib/format';

const SEVERITY: Record<Severity, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  critical: { label: 'Critical', color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-200', icon: <TrendingDown size={16} /> },
  warning: { label: 'Warning', color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', icon: <AlertTriangle size={16} /> },
  watch: { label: 'Watch', color: '#0891b2', bg: 'bg-cyan-50', border: 'border-cyan-200', icon: <Eye size={16} /> },
};

export function AlertsView({
  filters,
  refreshKey,
  defaultThreshold,
}: {
  filters: Filters;
  refreshKey: number;
  defaultThreshold: number;
}) {
  const [threshold, setThreshold] = useState(defaultThreshold || 7);
  const { data, loading, error } = useAsync(
    () => api.alerts(filters, threshold),
    [filters, refreshKey, threshold]
  );

  return (
    <div className="space-y-5">
      {/* Controls + explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <BellRing size={18} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">Impression-drop alerts</h2>
              <p className="text-sm text-slate-500 max-w-xl">
                Flags pages whose impressions have fallen for{' '}
                <span className="font-semibold text-slate-700">{threshold} consecutive days</span> or
                more in the selected market and date range.
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Consecutive days
            <input
              type="number"
              min={2}
              max={30}
              value={threshold}
              onChange={(e) => setThreshold(Math.max(2, Math.min(30, Number(e.target.value) || 7)))}
              className="w-16 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>
        {data && (
          <div className="flex gap-3 mt-4">
            <Counter label="Critical" n={data.counts.critical} sev="critical" />
            <Counter label="Warning" n={data.counts.warning} sev="warning" />
            <Counter label="Watch" n={data.counts.watch} sev="watch" />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-6">
          Failed to load alerts: {error}
        </div>
      )}
      {loading && <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">Analyzing impression trends…</div>}

      {data && !loading && data.alerts.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
          <p className="font-semibold text-slate-800 mt-3">No declining pages 🎉</p>
          <p className="text-sm text-slate-500 mt-1">
            No page has dropped impressions for {threshold}+ straight days in this market/range.
          </p>
        </div>
      )}

      {data && data.alerts.map((a) => <AlertCard key={a.page} alert={a} />)}
    </div>
  );
}

function Counter({ label, n, sev }: { label: string; n: number; sev: Severity }) {
  const s = SEVERITY[sev];
  return (
    <div className={`flex items-center gap-2 ${s.bg} ${s.border} border rounded-lg px-3 py-2`}>
      <span style={{ color: s.color }}>{s.icon}</span>
      <span className="text-sm font-semibold text-slate-700">{n}</span>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const s = SEVERITY[alert.severity];
  const impressions = alert.series.map((p) => p.impressions);
  return (
    <div className={`bg-white rounded-xl border ${s.border} overflow-hidden`}>
      <div className={`${s.bg} px-5 py-2 flex items-center gap-2 border-b ${s.border}`}>
        <span style={{ color: s.color }}>{s.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: s.color }}>
          {s.label}
        </span>
        <span className="text-xs text-slate-500">
          {alert.trailingDeclineDays} consecutive days down
        </span>
      </div>
      <div className="p-5 flex flex-wrap items-center gap-6">
        <div className="flex-1 min-w-[200px]">
          <div className="font-semibold text-slate-800 truncate" title={alert.page}>
            {alert.page}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {shortDate(alert.windowStart)} → {shortDate(alert.windowEnd)}
          </div>
        </div>
        <Metric label="Peak" value={fmtInt(alert.peakImpressions)} />
        <Metric label="Now" value={fmtInt(alert.currentImpressions)} />
        <Metric label="Change" value={`${alert.changePct}%`} negative={alert.changePct < 0} />
        <div className="text-right">
          <div className="text-xs text-slate-400 mb-1">Impressions trend</div>
          <Sparkline data={impressions} color={s.color} width={160} height={40} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div>
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-lg font-bold ${negative ? 'text-rose-600' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}
