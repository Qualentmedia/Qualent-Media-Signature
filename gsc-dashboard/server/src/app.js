import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { apiRouter } from './routes/api.js';

/**
 * Builds the configured Express app WITHOUT starting a listener, so it can be
 * used both as a long-running server (server/src/index.js) and as a Vercel
 * serverless function (api/index.js).
 */
const app = express();

// On Netlify, requests arrive under the function path
// (/.netlify/functions/api/...). Normalize them back to /api/... so the routes
// below match. No-op on Vercel / local where this prefix never appears.
const NETLIFY_PREFIX = '/.netlify/functions/api';
app.use((req, _res, next) => {
  if (req.url.startsWith(NETLIFY_PREFIX)) {
    req.url = '/api' + (req.url.slice(NETLIFY_PREFIX.length) || '');
  }
  next();
});

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser(config.sessionSecret));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRouter);
app.use('/api', apiRouter);

// Serve the built React app when a dist/ exists (local `npm start`, Docker, a
// VPS). On Vercel the static files are served by the CDN instead, and dist/ is
// not bundled into the function — so this block is simply skipped there.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Centralized error handler — surfaces Google API errors cleanly.
app.use((err, _req, res, _next) => {
  console.error('API error:', err?.message || err);
  const status = err?.code === 401 || err?.code === 403 ? err.code : 500;
  res.status(status).json({ error: err?.message || 'Internal server error' });
});

export default app;
