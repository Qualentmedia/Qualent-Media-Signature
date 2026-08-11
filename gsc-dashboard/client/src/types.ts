export interface Status {
  mode: 'live' | 'demo';
  googleConfigured: boolean;
  connected: boolean;
  email: string | null;
  siteUrl: string | null;
  defaultCountry: string;
  declineThreshold: number;
}

export interface Country {
  code: string;
  name: string;
}

export interface Totals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface TimePoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

export interface Overview {
  totals: Totals;
  previous: { clicks: number; impressions: number; ctr: number };
  timeseries: TimePoint[];
  live: boolean;
  country: string;
  days: number;
}

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SeriesPoint {
  date: string;
  impressions: number;
  clicks: number;
}

export type Severity = 'critical' | 'warning' | 'watch';

export interface Alert {
  page: string;
  severity: Severity;
  trailingDeclineDays: number;
  longestDeclineDays: number;
  declineThreshold: number;
  peakImpressions: number;
  currentImpressions: number;
  changePct: number;
  windowStart: string;
  windowEnd: string;
  series: SeriesPoint[];
}

export interface AlertsResponse {
  alerts: Alert[];
  threshold: number;
  live: boolean;
  country: string;
  days: number;
  counts: { critical: number; warning: number; watch: number };
}

export interface Property {
  siteUrl: string;
  permissionLevel: string;
}

export interface Filters {
  country: string;
  days: number;
}
