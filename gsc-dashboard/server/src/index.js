import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config, googleConfigured } from './config.js';
import { authRouter } from './routes/auth.js';
import { apiRouter } from './routes/api.js';

const app = express();

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

// Centralized error handler — surfaces Google API errors cleanly.
app.use((err, _req, res, _next) => {
  console.error('API error:', err?.message || err);
  const status = err?.code === 401 || err?.code === 403 ? err.code : 500;
  res.status(status).json({
    error: err?.message || 'Internal server error',
  });
});

app.listen(config.port, () => {
  const mode = googleConfigured ? 'LIVE (Google configured)' : 'DEMO (mock data)';
  console.log(`\n  GSC Dashboard API → http://localhost:${config.port}`);
  console.log(`  Data mode: ${mode}`);
  console.log(`  Allowed client origin: ${config.clientUrl}\n`);
});
