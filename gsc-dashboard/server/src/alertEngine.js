/**
 * Alert engine
 * ------------
 * Detects pages whose Search Console impressions are in a sustained decline.
 *
 * The headline rule (configurable): fire an alert when a page's impressions
 * have dropped on each of the last N consecutive days (default 7) — i.e. an
 * ongoing day-over-day decline streak ending on the most recent day.
 *
 * Input shape (per page):
 *   { page: string, series: [{ date: 'YYYY-MM-DD', impressions, clicks }] }
 *   `series` must be sorted ascending by date.
 */

export const DEFAULT_DECLINE_DAYS = 7;

/**
 * Length of the day-over-day decline streak that ENDS on the last data point.
 * Each step counts when impressions[i] < impressions[i-1].
 */
function trailingDeclineStreak(series) {
  let streak = 0;
  for (let i = series.length - 1; i > 0; i--) {
    if (series[i].impressions < series[i - 1].impressions) streak++;
    else break;
  }
  return streak;
}

/** Longest day-over-day decline streak anywhere in the series. */
function longestDeclineStreak(series) {
  let max = 0;
  let cur = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i].impressions < series[i - 1].impressions) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 0;
    }
  }
  return max;
}

function pct(from, to) {
  if (!from) return to ? 100 : 0;
  return ((to - from) / from) * 100;
}

/**
 * Evaluate a single page's daily series and return an alert record
 * (or null if it isn't declining enough to matter).
 */
export function evaluatePage({ page, series }, declineDays = DEFAULT_DECLINE_DAYS) {
  if (!series || series.length < declineDays + 1) return null;

  const trailing = trailingDeclineStreak(series);
  const longest = longestDeclineStreak(series);

  // Window covering the trailing streak (peak day -> latest day).
  const streakLen = Math.max(trailing, 1);
  const window = series.slice(series.length - (streakLen + 1));
  const startImpr = window[0].impressions;
  const endImpr = window[window.length - 1].impressions;
  const changePct = pct(startImpr, endImpr);

  let severity = null;
  if (trailing >= declineDays) severity = 'critical';
  else if (trailing >= Math.ceil(declineDays * 0.7)) severity = 'warning';
  else if (longest >= declineDays) severity = 'watch';

  if (!severity) return null;

  return {
    page,
    severity, // critical | warning | watch
    trailingDeclineDays: trailing,
    longestDeclineDays: longest,
    declineThreshold: declineDays,
    peakImpressions: startImpr,
    currentImpressions: endImpr,
    changePct: Math.round(changePct * 10) / 10,
    windowStart: window[0].date,
    windowEnd: window[window.length - 1].date,
    series, // full series so the UI can sparkline it
  };
}

/**
 * Run the engine over every page and return sorted alerts (worst first).
 */
export function detectImpressionDrops(pagesSeries, declineDays = DEFAULT_DECLINE_DAYS) {
  const order = { critical: 0, warning: 1, watch: 2 };
  return pagesSeries
    .map((p) => evaluatePage(p, declineDays))
    .filter(Boolean)
    .sort((a, b) => {
      if (order[a.severity] !== order[b.severity]) return order[a.severity] - order[b.severity];
      if (b.trailingDeclineDays !== a.trailingDeclineDays)
        return b.trailingDeclineDays - a.trailingDeclineDays;
      return a.changePct - b.changePct; // most negative first
    });
}
