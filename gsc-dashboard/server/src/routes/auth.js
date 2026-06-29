import { Router } from 'express';
import { google } from 'googleapis';
import { randomUUID } from 'node:crypto';
import { config, googleConfigured } from '../config.js';
import { createOAuthClient, setSession, getSession, clearSession } from '../store.js';

export const authRouter = Router();

const SID_COOKIE = 'gsc_sid';
const cookieOpts = { httpOnly: true, sameSite: 'lax', signed: true };

function ensureSid(req, res) {
  let sid = req.signedCookies?.[SID_COOKIE];
  if (!sid) {
    sid = randomUUID();
    res.cookie(SID_COOKIE, sid, cookieOpts);
  }
  return sid;
}

/** Begin the Google OAuth consent flow. */
authRouter.get('/google', (req, res) => {
  if (!googleConfigured) {
    return res
      .status(400)
      .json({ error: 'Google OAuth is not configured. Running in demo mode.' });
  }
  const sid = ensureSid(req, res);
  const oauth2 = createOAuthClient();
  const url = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: config.google.scopes,
    state: sid,
  });
  res.redirect(url);
});

/** OAuth redirect target — exchange the code, store tokens, bounce to client. */
authRouter.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const sid = ensureSid(req, res);
  if (!code) return res.redirect(`${config.clientUrl}/?auth=error`);

  try {
    const oauth2 = createOAuthClient();
    const { tokens } = await oauth2.getToken(String(code));
    oauth2.setCredentials(tokens);

    // Grab the account email for display.
    let email = null;
    try {
      const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
      const me = await oauth2Api.userinfo.get();
      email = me.data.email || null;
    } catch {
      /* email is best-effort */
    }

    setSession(sid, { tokens, email });
    res.redirect(`${config.clientUrl}/?auth=success`);
  } catch (err) {
    console.error('OAuth callback failed:', err.message);
    res.redirect(`${config.clientUrl}/?auth=error`);
  }
});

/** Choose which verified property (siteUrl) to report on. */
authRouter.post('/property', (req, res) => {
  const sid = req.signedCookies?.[SID_COOKIE];
  if (!getSession(sid)) return res.status(401).json({ error: 'Not authenticated' });
  const { siteUrl } = req.body || {};
  if (!siteUrl) return res.status(400).json({ error: 'siteUrl is required' });
  setSession(sid, { siteUrl });
  res.json({ ok: true, siteUrl });
});

/** Disconnect the Google account for this session. */
authRouter.post('/logout', (req, res) => {
  const sid = req.signedCookies?.[SID_COOKIE];
  if (sid) clearSession(sid);
  res.json({ ok: true });
});

export { SID_COOKIE };
