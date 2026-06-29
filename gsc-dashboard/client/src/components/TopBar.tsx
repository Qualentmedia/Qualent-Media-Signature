import { Database, Wifi, RefreshCw } from 'lucide-react';
import type { Status } from '../types';

interface Props {
  title: string;
  subtitle?: string;
  status: Status | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  right?: React.ReactNode;
}

export function TopBar({ title, subtitle, status, onRefresh, refreshing, right }: Props) {
  const live = status?.mode === 'live';
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {right}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${
            live ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          {live ? <Wifi size={13} /> : <Database size={13} />}
          {live ? 'Live GSC data' : 'Demo data'}
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
