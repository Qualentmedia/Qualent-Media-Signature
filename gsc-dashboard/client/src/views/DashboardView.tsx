import { useEffect, useState } from 'react';
import { MousePointerClick, Eye, Percent, TrendingUp, BellRing } from 'lucide-react';
import { api } from '../api';
import type { Overview, QueryRow, PageRow, AlertsResponse, Filters, Status } from '../types';
import { StatCard } from '../components/StatCard';
import { LineChart, BarChart } from '../components/charts';
import { fmtInt, fmtCompact, fmtPct, fmtPos, pctChange } from '../lib/format';
import type { ViewKey } from '../components/Sidebar';

interface Props {
  filters: Filters;
  status: Status | null;
  refreshKey: number;
  onNavigate: (v: ViewKey) => void;
}

export function DashboardView({ filters, status, refreshKey, onNavigate }: Props) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [queries, setQueries] = useState<QueryRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([
      api.overview(filters),
      api.queries(filters, 10),
      api.pages(filters, 10),
      api.alerts(filters, status?.declineThreshold ?? 7),
    ])
      .then(([ov, q, p, a]) => {
        if (!active) return;
        setOverview(ov);
        setQueries(q.rows);
        setPages(p.rows);
        setAlerts(a);
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [filters, refreshKey, status?.declineThreshold]);

  if (error) return <ErrorBox msg={error} />;
  if (loading || !overview) return <Skeleton />;

  const t = overview.totals;
  const prev = overview.previous;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Clicks"
          value={fmtInt(t.clicks)}
          icon={<MousePointerClick size={18} />}
          delta={pctChange(t.clicks, prev.clicks)}
          accent="#2563eb"
          highlight
        />
        <StatCard
          label="Total Impressions"
          value={fmtInt(t.impressions)}
          icon={<Eye size={18} />}
          delta={pctChange(t.impressions, prev.impressions)}
          accent="#7c3aed"
        />
        <StatCard
          label="Average CTR"
          value={fmtPct(t.ctr)}
          icon={<Percent size={18} />}
          delta={pctChange(t.ctr, prev.ctr)}
          accent="#0891b2"
        />
        <StatCard
          label="Average Position"
          value={fmtPos(t.position)}
          icon={<TrendingUp size={18} />}
          accent="#ea580c"
          invertDelta
        />
      </div>

      {/* Alert banner */}
      {alerts && alerts.counts.critical > 0 && (
        <button
          onClick={() => onNavigate('alerts')}
          className="w-full flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl px-5 py-4 text-left hover:bg-rose-100 transition"
        >
          <BellRing size={20} className="shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">
              {alerts.counts.critical} page{alerts.counts.critical > 1 ? 's' : ''} with{' '}
              {alerts.threshold}+ consecutive days of falling impressions
            </span>
            <span className="text-rose-600"> — click to review the alerts.</span>
          </div>
          <span className="text-sm font-medium underline">View alerts →</span>
        </button>
      )}

      {/* Clicks & impressions trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Clicks & Impressions over time</h2>
          <span className="text-xs text-slate-400">{overview.timeseries.length} days</span>
        </div>
        <LineChart
          series={[
            {
              name: 'Clicks',
              color: '#2563eb',
              points: overview.timeseries.map((d) => ({ date: d.date, value: d.clicks })),
            },
            {
              name: 'Impressions',
              color: '#c4b5fd',
              points: overview.timeseries.map((d) => ({ date: d.date, value: d.impressions })),
            },
          ]}
          yFormat={fmtCompact}
        />
      </div>

      {/* Top queries + pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Top Queries by Clicks" onMore={() => onNavigate('queries')}>
          <BarChart data={queries.map((q) => ({ label: q.query, value: q.clicks }))} />
        </Panel>
        <Panel title="Top Pages by Clicks" onMore={() => onNavigate('pages')}>
          <BarChart data={pages.map((p) => ({ label: p.page, value: p.clicks }))} color="#7c3aed" />
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children, onMore }: { title: string; children: React.ReactNode; onMore: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <button onClick={onMore} className="text-sm font-medium text-blue-600 hover:underline">
          See all →
        </button>
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border border-slate-200" />
        ))}
      </div>
      <div className="h-72 bg-white rounded-xl border border-slate-200" />
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-6">
      <p className="font-semibold">Could not load data</p>
      <p className="text-sm mt-1">{msg}</p>
    </div>
  );
}
