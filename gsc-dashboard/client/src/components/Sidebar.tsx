import { LayoutDashboard, Search, FileText, BellRing, Settings, Activity } from 'lucide-react';
import type { ReactNode } from 'react';

export type ViewKey = 'dashboard' | 'queries' | 'pages' | 'alerts' | 'settings';

const NAV: { key: ViewKey; label: string; icon: ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { key: 'queries', label: 'Queries', icon: <Search size={18} /> },
  { key: 'pages', label: 'Pages', icon: <FileText size={18} /> },
  { key: 'alerts', label: 'Alerts', icon: <BellRing size={18} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

interface Props {
  view: ViewKey;
  onChange: (v: ViewKey) => void;
  alertCount: number;
}

export function Sidebar({ view, onChange, alertCount }: Props) {
  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity size={18} className="text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-white font-bold text-sm">Search Console</div>
          <div className="text-slate-400 text-xs">Qualent Media</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              view === item.key ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-left">{item.label}</span>
            {item.key === 'alerts' && alertCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {alertCount}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-4 text-xs text-slate-500 border-t border-slate-800">
        Default market: <span className="text-slate-300 font-medium">United States</span>
      </div>
    </aside>
  );
}
