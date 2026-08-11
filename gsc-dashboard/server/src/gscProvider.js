import { google } from 'googleapis';
import { rangeForDays } from './dates.js';

/**
 * Live Google Search Console provider.
 *
 * Implements the same interface as mockProvider but talks to the real
 * Search Console API (searchanalytics.query) using an authenticated
 * OAuth2 client + the property (siteUrl) chosen by the user.
 *
 * ISO-3166-1 alpha-3 country codes (e.g. "usa", "gbr") are what GSC expects
 * in the `country` dimension filter — which is exactly what our UI uses.
 */
export function createGscProvider(oauth2Client, siteUrl) {
  const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });
  const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

  function countryFilter(country) {
    if (!country || country === 'all') return [];
    return [
      {
        filters: [{ dimension: 'country', operator: 'equals', expression: country }],
      },
    ];
  }

  async function runQuery({ days, dimensions, country, rowLimit = 1000, range }) {
    const { startDate, endDate } = range || rangeForDays(days);
    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions,
        dimensionFilterGroups: countryFilter(country),
        rowLimit,
        dataState: 'all',
      },
    });
    return res.data.rows || [];
  }

  return {
    mode: 'live',

    async listProperties() {
      const res = await webmasters.sites.list();
      return (res.data.siteEntry || []).map((s) => ({
        siteUrl: s.siteUrl,
        permissionLevel: s.permissionLevel,
      }));
    },

    async getOverview({ country = 'usa', days = 28 }) {
      const range = rangeForDays(days);
      const prevDays = days;
      // previous period ends the day before `range.startDate`
      const prevEnd = new Date(range.startDate);
      prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
      const prevStart = new Date(prevEnd);
      prevStart.setUTCDate(prevStart.getUTCDate() - (prevDays - 1));
      const prevRange = {
        startDate: prevStart.toISOString().slice(0, 10),
        endDate: prevEnd.toISOString().slice(0, 10),
      };

      const [byDate, totalsRow, prevRow] = await Promise.all([
        runQuery({ days, dimensions: ['date'], country, range }),
        runQuery({ days, dimensions: [], country, range }),
        runQuery({ days, dimensions: [], country, range: prevRange }),
      ]);

      const timeseries = byDate.map((r) => ({
        date: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
      }));

      const t = totalsRow[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      const p = prevRow[0] || { clicks: 0, impressions: 0, ctr: 0 };

      return {
        totals: {
          clicks: t.clicks,
          impressions: t.impressions,
          ctr: t.ctr,
          position: t.position,
        },
        previous: { clicks: p.clicks, impressions: p.impressions, ctr: p.ctr },
        timeseries,
      };
    },

    async getQueries({ country = 'usa', days = 28, limit = 100 }) {
      const rows = await runQuery({ days, dimensions: ['query'], country, rowLimit: limit });
      return rows
        .map((r) => ({
          query: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: r.ctr,
          position: Math.round(r.position * 10) / 10,
        }))
        .sort((a, b) => b.clicks - a.clicks);
    },

    async getPages({ country = 'usa', days = 28, limit = 100 }) {
      const rows = await runQuery({ days, dimensions: ['page'], country, rowLimit: limit });
      return rows
        .map((r) => ({
          page: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: r.ctr,
          position: Math.round(r.position * 10) / 10,
        }))
        .sort((a, b) => b.clicks - a.clicks);
    },

    async getPageDailySeries({ country = 'usa', days = 28 }) {
      // One call with [date, page]; group into per-page series.
      const rows = await runQuery({
        days,
        dimensions: ['date', 'page'],
        country,
        rowLimit: 25000,
      });
      const byPage = new Map();
      for (const r of rows) {
        const [date, page] = r.keys;
        if (!byPage.has(page)) byPage.set(page, []);
        byPage.get(page).push({ date, impressions: r.impressions, clicks: r.clicks });
      }
      const out = [];
      for (const [page, series] of byPage) {
        series.sort((a, b) => a.date.localeCompare(b.date));
        out.push({ page, series });
      }
      return out;
    },
  };
}
