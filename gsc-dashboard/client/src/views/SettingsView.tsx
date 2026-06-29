import { useState } from 'react';
import { Plug, CheckCircle2, LogOut, Globe, AlertCircle, Database } from 'lucide-react';
import { api } from '../api';
import type { Status, Property } from '../types';
import { useAsync } from '../lib/useAsync';

interface Props {
  status: Status | null;
  onChanged: () => void;
}

export function SettingsView({ status, onChanged }: Props) {
  const [busy, setBusy] = useState(false);
  const connected = status?.connected;
  const { data: properties } = useAsync<Property[]>(
    () => (connected ? api.properties() : Promise.resolve([])),
    [connected]
  );

  const selectProperty = async (siteUrl: string) => {
    setBusy(true);
    try {
      await api.selectProperty(siteUrl);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await api.logout();
    onChanged();
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Connection card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Plug size={18} />
          </span>
          <h2 className="font-semibold text-slate-800">Google Search Console connection</h2>
        </div>

        {!status?.googleConfigured && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <Database size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Running in demo mode.</p>
              <p className="mt-1">
                The dashboard is showing realistic sample data. To connect a real account, add Google
                OAuth credentials to <code className="bg-amber-100 px-1 rounded">server/.env</code>{' '}
                (see <code className="bg-amber-100 px-1 rounded">.env.example</code>) and restart the
                server. Everything below will then go live.
              </p>
            </div>
          </div>
        )}

        {status?.googleConfigured && !connected && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Connect your Google account to pull live Search Console data. We request read-only access.
            </p>
            <a
              href="/api/auth/google"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700"
            >
              <Plug size={16} /> Connect Google Search Console
            </a>
          </div>
        )}

        {connected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
              <CheckCircle2 size={18} />
              Connected as <span className="font-semibold">{status?.email || 'your Google account'}</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
            >
              <LogOut size={15} /> Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Property picker */}
      {connected && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-800 mb-1">Select a property</h3>
          <p className="text-sm text-slate-500 mb-4">Choose which verified site to report on.</p>
          <div className="space-y-2">
            {(properties ?? []).map((p) => (
              <button
                key={p.siteUrl}
                disabled={busy}
                onClick={() => selectProperty(p.siteUrl)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition ${
                  status?.siteUrl === p.siteUrl
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Globe size={16} className="text-slate-400" />
                <span className="flex-1 text-sm font-medium text-slate-700">{p.siteUrl}</span>
                <span className="text-xs text-slate-400">{p.permissionLevel}</span>
                {status?.siteUrl === p.siteUrl && <CheckCircle2 size={16} className="text-blue-600" />}
              </button>
            ))}
            {properties && properties.length === 0 && (
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <AlertCircle size={15} /> No verified properties found on this account.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Defaults info */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-3">Dashboard defaults</h3>
        <dl className="grid grid-cols-2 gap-y-3 text-sm">
          <dt className="text-slate-500">Default market</dt>
          <dd className="font-medium text-slate-700">United States (US)</dd>
          <dt className="text-slate-500">Primary metric</dt>
          <dd className="font-medium text-slate-700">Clicks</dd>
          <dt className="text-slate-500">Default date range</dt>
          <dd className="font-medium text-slate-700">Last 28 days</dd>
          <dt className="text-slate-500">Alert rule</dt>
          <dd className="font-medium text-slate-700">
            {status?.declineThreshold ?? 7} consecutive days of falling impressions
          </dd>
        </dl>
      </div>
    </div>
  );
}
