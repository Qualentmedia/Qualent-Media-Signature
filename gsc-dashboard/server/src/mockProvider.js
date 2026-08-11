import { lastNDates } from './dates.js';

/**
 * Deterministic mock data provider.
 *
 * Implements the same interface as the live Search Console provider so the
 * routes don't care which one is active. Data is generated once at startup
 * from a fixed seed, with full per-day / per-country granularity so that the
 * country filter (default USA) and date-range selector behave for real.
 */

// ── Seeded RNG (mulberry32) so the demo dataset is stable across restarts ──
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const COUNTRIES = [
  { code: 'usa', name: 'United States', weight: 0.46 },
  { code: 'gbr', name: 'United Kingdom', weight: 0.14 },
  { code: 'ind', name: 'India', weight: 0.13 },
  { code: 'can', name: 'Canada', weight: 0.1 },
  { code: 'aus', name: 'Australia', weight: 0.09 },
  { code: 'deu', name: 'Germany', weight: 0.08 },
];

const QUERIES = [
  'email signature generator', 'free email signature', 'html email signature',
  'professional email signature', 'email signature template', 'gmail signature maker',
  'outlook signature generator', 'b2b marketing agency', 'marketing agency austin',
  'lead generation services', 'demand generation agency', 'saas marketing agency',
  'content marketing services', 'seo agency for startups', 'qualent media',
  'best email signature software', 'corporate email signature', 'email signature with banner',
  'email signature design', 'company email signature', 'marketing automation agency',
  'b2b lead generation company', 'paid media agency', 'linkedin marketing agency',
  'email signature best practices', 'add logo to email signature', 'email disclaimer template',
  'real estate email signature', 'law firm email signature', 'sales email signature',
  'email signature size', 'animated email signature', 'email signature generator with image',
  'how to create email signature', 'marketing agency for b2b saas', 'growth marketing agency',
  'performance marketing agency', 'account based marketing agency', 'email signature dimensions',
  'mobile friendly email signature',
];

const PAGES = [
  '/', '/email-signature-generator', '/templates', '/templates/professional',
  '/templates/corporate', '/blog/email-signature-best-practices', '/blog/add-logo-to-signature',
  '/blog/email-disclaimer-examples', '/services', '/services/lead-generation',
  '/services/demand-generation', '/services/content-marketing', '/services/seo',
  '/services/paid-media', '/about', '/contact', '/pricing', '/case-studies',
  '/case-studies/saas-growth', '/blog/b2b-marketing-trends', '/blog/abm-playbook',
  '/templates/real-estate', '/templates/legal', '/templates/sales',
];

function round(n) {
  return Math.round(n);
}

function buildDataset() {
  const rng = mulberry32(20240617);
  const dates = lastNDates(90);

  // Per-country daily multiplier curve (gentle weekly seasonality + drift).
  const seasonal = dates.map((_, i) => {
    const weekly = 1 + 0.12 * Math.sin((i / 7) * Math.PI * 2);
    const drift = 1 + (i / dates.length) * 0.25; // slow growth over the window
    return weekly * drift;
  });

  // ── Queries: a base profile per query, split across countries ──
  const queries = QUERIES.map((query, idx) => {
    const popularity = 1 - idx / (QUERIES.length * 1.2); // ranked-ish
    const baseImpr = 40 + popularity * 900 + rng() * 120;
    const position = 1.5 + (1 - popularity) * 22 + rng() * 4;
    const ctr = Math.max(0.005, (0.35 - position * 0.012) * (0.6 + rng() * 0.8));
    return { query, baseImpr, position, ctr };
  });

  // ── Pages: daily impression/click series per country ──
  // A handful are engineered into a sustained tail decline to exercise alerts.
  const decliningPages = new Set(['/templates/legal', '/blog/abm-playbook', '/services/seo']);

  const pages = PAGES.map((page, idx) => {
    const popularity = 1 - idx / (PAGES.length * 1.2);
    const baseImpr = 30 + popularity * 700 + rng() * 90;
    const position = 2 + (1 - popularity) * 20 + rng() * 4;
    const ctr = Math.max(0.004, (0.32 - position * 0.011) * (0.6 + rng() * 0.8));

    const seriesByCountry = {};
    for (const c of COUNTRIES) {
      const series = dates.map((date, i) => {
        const fromEnd = dates.length - 1 - i;
        const declineTail = decliningPages.has(page) && fromEnd <= 9;
        // For engineered declining pages, the last 10 days step down cleanly
        // (no jitter) so the streak is strictly monotonic and fires the alert.
        const mult = declineTail
          ? 1.15 - (9 - fromEnd) * 0.1 // strictly decreasing, no jitter/seasonality
          : seasonal[i] * (0.85 + rng() * 0.3);
        const impressions = round(baseImpr * c.weight * 3.2 * mult);
        const clicks = round(impressions * ctr * (declineTail ? 1 : 0.8 + rng() * 0.4));
        return { date, impressions, clicks };
      });
      seriesByCountry[c.code] = series;
    }
    return { page, position, ctr, seriesByCountry };
  });

  return { dates, seasonal, queries, pages };
}

const DATA = buildDataset();

function countryWeight(code) {
  const c = COUNTRIES.find((x) => x.code === code);
  return c ? c.weight : 0.1;
}

function sliceDates(days) {
  const all = DATA.dates;
  return all.slice(Math.max(0, all.length - days));
}

// ── Provider interface ───────────────────────────────────────────────────

export const mockProvider = {
  mode: 'demo',

  async listProperties() {
    return [
      { siteUrl: 'sc-domain:qualentmedia.com', permissionLevel: 'siteOwner' },
      { siteUrl: 'https://www.qualentmedia.com/', permissionLevel: 'siteFullUser' },
    ];
  },

  async getOverview({ country = 'usa', days = 28 }) {
    const windowDates = sliceDates(days);
    const offset = DATA.dates.length - windowDates.length;

    // Build daily totals by summing pages for the country.
    const timeseries = windowDates.map((date, i) => {
      let clicks = 0;
      let impressions = 0;
      for (const p of DATA.pages) {
        const pt = p.seriesByCountry[country][offset + i];
        clicks += pt.clicks;
        impressions += pt.impressions;
      }
      const ctr = impressions ? clicks / impressions : 0;
      return { date, clicks, impressions, ctr };
    });

    const sum = (arr, k) => arr.reduce((s, x) => s + x[k], 0);
    const totalClicks = sum(timeseries, 'clicks');
    const totalImpr = sum(timeseries, 'impressions');
    const avgCtr = totalImpr ? totalClicks / totalImpr : 0;
    // Weighted average position across pages (impression-weighted).
    let posNum = 0;
    let posDen = 0;
    for (const p of DATA.pages) {
      const impr = p.seriesByCountry[country].slice(offset).reduce((s, x) => s + x.impressions, 0);
      posNum += p.position * impr;
      posDen += impr;
    }
    const avgPosition = posDen ? posNum / posDen : 0;

    // Previous period (same length, immediately before) for deltas.
    const prevStart = Math.max(0, offset - windowDates.length);
    let pClicks = 0;
    let pImpr = 0;
    for (const p of DATA.pages) {
      const seg = p.seriesByCountry[country].slice(prevStart, offset);
      pClicks += seg.reduce((s, x) => s + x.clicks, 0);
      pImpr += seg.reduce((s, x) => s + x.impressions, 0);
    }

    return {
      totals: {
        clicks: totalClicks,
        impressions: totalImpr,
        ctr: avgCtr,
        position: avgPosition,
      },
      previous: {
        clicks: pClicks,
        impressions: pImpr,
        ctr: pImpr ? pClicks / pImpr : 0,
      },
      timeseries,
    };
  },

  async getQueries({ country = 'usa', days = 28, limit = 100 }) {
    const w = countryWeight(country);
    const scale = days / 28;
    const rows = DATA.queries.map((q) => {
      const impressions = round(q.baseImpr * w * 3.2 * scale * (0.9 + 0.2));
      const clicks = round(impressions * q.ctr);
      return {
        query: q.query,
        clicks,
        impressions,
        ctr: impressions ? clicks / impressions : 0,
        position: Math.round(q.position * 10) / 10,
      };
    });
    rows.sort((a, b) => b.clicks - a.clicks);
    return rows.slice(0, limit);
  },

  async getPages({ country = 'usa', days = 28, limit = 100 }) {
    const windowDates = sliceDates(days);
    const offset = DATA.dates.length - windowDates.length;
    const rows = DATA.pages.map((p) => {
      const seg = p.seriesByCountry[country].slice(offset);
      const clicks = seg.reduce((s, x) => s + x.clicks, 0);
      const impressions = seg.reduce((s, x) => s + x.impressions, 0);
      return {
        page: p.page,
        clicks,
        impressions,
        ctr: impressions ? clicks / impressions : 0,
        position: Math.round(p.position * 10) / 10,
      };
    });
    rows.sort((a, b) => b.clicks - a.clicks);
    return rows.slice(0, limit);
  },

  async getPageDailySeries({ country = 'usa', days = 28 }) {
    const windowDates = sliceDates(days);
    const offset = DATA.dates.length - windowDates.length;
    return DATA.pages.map((p) => ({
      page: p.page,
      series: p.seriesByCountry[country].slice(offset).map((x) => ({
        date: x.date,
        impressions: x.impressions,
        clicks: x.clicks,
      })),
    }));
  },
};
