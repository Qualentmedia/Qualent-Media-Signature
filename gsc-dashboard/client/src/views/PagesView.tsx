import { api } from '../api';
import type { Filters } from '../types';
import { useAsync } from '../lib/useAsync';
import { MetricTable } from '../components/MetricTable';

export function PagesView({ filters, refreshKey }: { filters: Filters; refreshKey: number }) {
  const { data, loading, error } = useAsync(() => api.pages(filters, 500), [filters, refreshKey]);

  if (error) return <Box className="text-rose-600">Failed to load pages: {error}</Box>;
  if (loading || !data) return <Box>Loading pages…</Box>;

  const rows = data.rows.map((r) => ({
    name: r.page,
    clicks: r.clicks,
    impressions: r.impressions,
    ctr: r.ctr,
    position: r.position,
  }));

  return (
    <MetricTable rows={rows} nameHeader="Page" searchPlaceholder="Filter pages… (e.g. /templates)" />
  );
}

function Box({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500 ${className}`}>
      {children}
    </div>
  );
}
