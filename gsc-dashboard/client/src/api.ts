import type {
  Status,
  Country,
  Overview,
  QueryRow,
  PageRow,
  AlertsResponse,
  Property,
  Filters,
} from './types';

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const b = await res.json().catch(() => ({}));
    throw new Error(b.error || `Request failed (${res.status})`);
  }
  return res.json();
}

const qs = (f: Filters, extra: Record<string, string | number> = {}) => {
  const p = new URLSearchParams({
    country: f.country,
    days: String(f.days),
    ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
  });
  return p.toString();
};

export const api = {
  status: () => get<Status>('/api/status'),
  countries: () => get<Country[]>('/api/countries'),
  properties: () => get<Property[]>('/api/properties'),
  overview: (f: Filters) => get<Overview>(`/api/overview?${qs(f)}`),
  queries: (f: Filters, limit = 200) => get<{ rows: QueryRow[] }>(`/api/queries?${qs(f, { limit })}`),
  pages: (f: Filters, limit = 200) => get<{ rows: PageRow[] }>(`/api/pages?${qs(f, { limit })}`),
  alerts: (f: Filters, threshold = 7) =>
    get<AlertsResponse>(`/api/alerts?${qs(f, { threshold })}`),
  selectProperty: (siteUrl: string) => post<{ ok: boolean }>('/api/auth/property', { siteUrl }),
  logout: () => post<{ ok: boolean }>('/api/auth/logout'),
};
