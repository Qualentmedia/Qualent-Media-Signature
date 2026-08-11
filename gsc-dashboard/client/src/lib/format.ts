export const fmtInt = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(n || 0));

export const fmtCompact = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);

export const fmtPct = (n: number, digits = 2) => `${((n || 0) * 100).toFixed(digits)}%`;

export const fmtPos = (n: number) => (n ? n.toFixed(1) : '—');

export const fmtDelta = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;

export function pctChange(curr: number, prev: number) {
  if (!prev) return curr ? 100 : 0;
  return ((curr - prev) / prev) * 100;
}

export function shortDate(iso: string) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
