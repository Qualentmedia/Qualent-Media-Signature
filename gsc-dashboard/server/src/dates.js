/** Small date helpers shared across providers. */

export function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

/** Array of YYYY-MM-DD strings for the last `days` days, ending yesterday. */
export function lastNDates(days) {
  const out = [];
  const today = new Date();
  // Search Console data lags ~2 days; end the window 2 days ago.
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 2);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    out.push(isoDate(d));
  }
  return out;
}

export function rangeForDays(days) {
  const dates = lastNDates(days);
  return { startDate: dates[0], endDate: dates[dates.length - 1] };
}
