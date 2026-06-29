import { Globe, CalendarDays } from 'lucide-react';
import type { Country, Filters } from '../types';

const RANGES = [
  { days: 7, label: 'Last 7 days' },
  { days: 28, label: 'Last 28 days' },
  { days: 90, label: 'Last 90 days' },
];

interface Props {
  filters: Filters;
  countries: Country[];
  onChange: (f: Filters) => void;
}

export function FiltersBar({ filters, countries, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
        <Globe size={16} className="text-slate-400" />
        <select
          className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          value={filters.country}
          onChange={(e) => onChange({ ...filters, country: e.target.value })}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
              {c.code === 'usa' ? ' (default)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
        <CalendarDays size={16} className="text-slate-400 ml-2" />
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => onChange({ ...filters, days: r.days })}
            className={`text-sm font-medium px-3 py-1.5 rounded-md transition ${
              filters.days === r.days
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
