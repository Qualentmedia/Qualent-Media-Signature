import { Router } from 'express';
import { googleConfigured } from '../config.js';
import { getSession, clientForSession } from '../store.js';
import { mockProvider, COUNTRIES } from '../mockProvider.js';
import { createGscProvider } from '../gscProvider.js';
import { detectImpressionDrops, DEFAULT_DECLINE_DAYS } from '../alertEngine.js';
import { SID_COOKIE } from './auth.js';

export const apiRouter = Router();

/**
 * Resolve the active data provider for this request.
 * Live GSC if the session is authenticated AND a property is selected;
 * otherwise the demo provider.
 */
function resolveProvider(req) {
  const sid = req.signedCookies?.[SID_COOKIE];
  const session = getSession(sid);
  if (googleConfigured && session?.tokens && session?.siteUrl) {
    const client = clientForSession(sid);
    if (client) {
      return { provider: createGscProvider(client, session.siteUrl), session, live: true };
    }
  }
  return { provider: mockProvider, session, live: false };
}

function parseParams(req) {
  const country = (req.query.country || 'usa').toString().toLowerCase();
  const days = Math.min(Math.max(parseInt(req.query.days, 10) || 28, 7), 90);
  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 1000);
  return { country, days, limit };
}

/** Connection / mode status for the UI banner + settings page. */
apiRouter.get('/status', async (req, res) => {
  const sid = req.signedCookies?.[SID_COOKIE];
  const session = getSession(sid);
  const connected = Boolean(googleConfigured && session?.tokens);
  res.json({
    mode: connected && session?.siteUrl ? 'live' : 'demo',
    googleConfigured,
    connected,
    email: session?.email || null,
    siteUrl: session?.siteUrl || null,
    defaultCountry: 'usa',
    declineThreshold: DEFAULT_DECLINE_DAYS,
  });
});

/** Countries available for the filter (with display names). */
apiRouter.get('/countries', (_req, res) => {
  res.json(COUNTRIES.map((c) => ({ code: c.code, name: c.name })));
});

/** Verified Search Console properties (live only). */
apiRouter.get('/properties', async (req, res, next) => {
  try {
    const { provider } = resolveProvider(req);
    res.json(await provider.listProperties());
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/overview', async (req, res, next) => {
  try {
    const { provider, live } = resolveProvider(req);
    const { country, days } = parseParams(req);
    const data = await provider.getOverview({ country, days });
    res.json({ ...data, live, country, days });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/queries', async (req, res, next) => {
  try {
    const { provider, live } = resolveProvider(req);
    const { country, days, limit } = parseParams(req);
    const rows = await provider.getQueries({ country, days, limit });
    res.json({ rows, live, country, days });
  } catch (err) {
    next(err);
  }
});

apiRouter.get('/pages', async (req, res, next) => {
  try {
    const { provider, live } = resolveProvider(req);
    const { country, days, limit } = parseParams(req);
    const rows = await provider.getPages({ country, days, limit });
    res.json({ rows, live, country, days });
  } catch (err) {
    next(err);
  }
});

/**
 * Impression-drop alerts. Pulls per-page daily series and runs the alert
 * engine (default: 7 consecutive days of decline). `threshold` is tunable.
 */
apiRouter.get('/alerts', async (req, res, next) => {
  try {
    const { provider, live } = resolveProvider(req);
    const { country, days } = parseParams(req);
    const threshold = Math.min(
      Math.max(parseInt(req.query.threshold, 10) || DEFAULT_DECLINE_DAYS, 2),
      30
    );
    const pagesSeries = await provider.getPageDailySeries({ country, days });
    const alerts = detectImpressionDrops(pagesSeries, threshold);
    res.json({
      alerts,
      threshold,
      live,
      country,
      days,
      counts: {
        critical: alerts.filter((a) => a.severity === 'critical').length,
        warning: alerts.filter((a) => a.severity === 'warning').length,
        watch: alerts.filter((a) => a.severity === 'watch').length,
      },
    });
  } catch (err) {
    next(err);
  }
});
