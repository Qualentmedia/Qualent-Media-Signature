import { api } from '../api';
import type { Filters } from '../types';
import { useAsync } from '../lib/useAsync';
import { MetricTable } from '../components/MetricTable';

export function QueriesView({ filters, refreshKey }: { filters: Filters; refreshKey: number }) {
  const { data, loading, error } = useAsync(() => api.queries(filters, 500), [filters, refreshKey]);

  if (error) return <Box className="text-rose-600">Failed to load queries: {error}</Box>;
  if (loading || !data) return <Box>Loading queries…</Box>;

  const rows = data.rows.map((r) => ({
    name: r.query,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  return (
    <MetricTable
      rows={rows}
      nameHeader="Query"
      searchPlaceholder="Filter queries… (e.g. email signature)"
    />
  );
}

function Box({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 ${className}`}>
      {children}
    </div>
  );
}
