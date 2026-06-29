import { Router } from 'express';
import { google } from 'googleapis';
import { randomUUID } from 'node:crypto';
import { config, googleConfigured } from '../config.js';
import { createOAuthClient, readSession, saveSession, clearSession } from '../store.js';

export const authRouter = Router();

const STATE_COOKIE = 'gsc_oauth_state';

/** Begin the Google OAuth consent flow. */
authRouter.get('/google', (req, res) => {
  if (!googleConfigured) {
    return res.status(400).json({ error: 'Google OAuth is not configured. Running in demo mode.' });
  }
  // CSRF protection: round-trip a random state value via a short-lived cookie.
  const state = randomUUID();
  res.cookie(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
    maxAge: 10 * 60 * 1000,
    path: '/',
  });

  const oauth2 = createOAuthClient();
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: config.google.scopes,
    state,
  });
  res.redirect(url);
});

/** OAuth redirect target — exchange the code, store tokens, bounce to client. */
authRouter.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;
  const expected = req.cookies?.[STATE_COOKIE];
  res.clearCookie(STATE_COOKIE, { path: '/' });

  if (!code || !state || state !== expected) {
    return res.redirect(`${config.clientUrl}/?auth=error`);
  }

  try {
    const oauth2 = createOAuthClient();
    const { tokens } = await oauth2.getToken(String(code));
    oauth2.setCredentials(tokens);

    // Grab the account email for display (best-effort).
    let email = null;
    try {
      const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
      const me = await oauth2Api.userinfo.get();
      email = me.data.email || null;
    } catch {
      /* email is best-effort */
    }

    const stored = { ...tokens };
    delete stored.id_token; // keep the encrypted cookie comfortably small
    saveSession(req, res, { tokens: stored, email });
    res.redirect(`${config.clientUrl}/?auth=success`);
  } catch (err) {
    console.error('OAuth callback failed:', err.message);
    res.redirect(`${config.clientUrl}/?auth=error`);
  }
});

/** Choose which verified property (siteUrl) to report on. */
authRouter.post('/property', (req, res) => {
  if (!readSession(req)?.tokens) return res.status(401).json({ error: 'Not authenticated' });
  const { siteUrl } = req.body || {};
  if (!siteUrl) return res.status(400).json({ error: 'siteUrl is required' });
  saveSession(req, res, { siteUrl });
  res.json({ ok: true, siteUrl });
});

/** Disconnect the Google account for this session. */
authRouter.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});
