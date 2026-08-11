import { useCallback, useEffect, useState } from 'react';
import { Sidebar, type ViewKey } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { FiltersBar } from './components/FiltersBar';
import { DashboardView } from './views/DashboardView';
import { QueriesView } from './views/QueriesView';
import { PagesView } from './views/PagesView';
import { AlertsView } from './views/AlertsView';
import { SettingsView } from './views/SettingsView';
import { api } from './api';
import type { Status, Country, Filters } from './types';

const TITLES: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Overview', subtitle: 'Search performance at a glance' },
  queries: { title: 'Queries', subtitle: 'Which search queries rank and drive clicks' },
  pages: { title: 'Pages', subtitle: 'Performance by landing page' },
  alerts: { title: 'Alerts', subtitle: 'Pages with sustained impression declines' },
  settings: { title: 'Settings', subtitle: 'Connection, properties & defaults' },
};

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [status, setStatus] = useState<Status | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filters, setFilters] = useState<Filters>({ country: 'usa', days: 28 });
  const [alertCount, setAlertCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatus = useCallback(() => {
    api.status().then(setStatus).catch(() => setStatus(null));
  }, []);

  useEffect(() => {
    loadStatus();
    api.countries().then(setCountries).catch(() => setCountries([]));
  }, [loadStatus]);

  // keep the sidebar alert badge in sync with current filters
  useEffect(() => {
    api
      .alerts(filters, status?.declineThreshold ?? 7)
      .then((r) => setAlertCount(r.counts.critical + r.counts.warning))
      .catch(() => setAlertCount(0));
  }, [filters, refreshKey, status?.declineThreshold]);

  // surface OAuth callback result, then clean the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth')) {
      loadStatus();
      setView('settings');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [loadStatus]);

  const refresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    loadStatus();
    setTimeout(() => setRefreshing(false), 600);
  };

  const meta = TITLES[view];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar view={view} onChange={setView} alertCount={alertCount} />

      <main className="flex-1 min-w-0 px-6 lg:px-8 py-6">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          status={status}
          onRefresh={view === 'settings' ? undefined : refresh}
          refreshing={refreshing}
          right={
            view !== 'settings' ? (
              <FiltersBar filters={filters} countries={countries} onChange={setFilters} />
            ) : undefined
          }
        />

        {view === 'dashboard' && (
          <DashboardView filters={filters} status={status} refreshKey={refreshKey} onNavigate={setView} />
        )}
        {view === 'queries' && <QueriesView filters={filters} refreshKey={refreshKey} />}
        {view === 'pages' && <PagesView filters={filters} refreshKey={refreshKey} />}
        {view === 'alerts' && (
          <AlertsView filters={filters} refreshKey={refreshKey} defaultThreshold={status?.declineThreshold ?? 7} />
        )}
        {view === 'settings' && <SettingsView status={status} onChanged={loadStatus} />}
      </main>
    </div>
  );
}
