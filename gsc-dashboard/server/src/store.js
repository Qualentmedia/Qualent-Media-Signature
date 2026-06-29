import crypto from 'node:crypto';
import { google } from 'googleapis';
import { config } from './config.js';

/**
 * Stateless session store backed by an encrypted, httpOnly cookie.
 *
 * The session payload — { tokens, email, siteUrl } — is serialized, encrypted
 * with AES-256-GCM (key derived from SESSION_SECRET) and stored in the
 * `gsc_session` cookie. This needs no database and works identically on a
 * long-running server and on serverless platforms (Vercel / Netlify), where an
 * in-memory store would not survive between invocations.
 *
 * For a multi-user deployment you'd instead store sessions server-side (e.g.
 * Redis / Vercel KV) keyed by a session id — swap the read/write helpers below.
 */

const COOKIE = 'gsc_session';
const KEY = crypto.scryptSync(config.sessionSecret, 'gsc-session-salt', 32);

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.cookieSecure,
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

function encrypt(obj) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(obj), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, data]).toString('base64url');
}

function decrypt(value) {
  try {
    const buf = Buffer.from(value, 'base64url');
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(tag);
    const out = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(out.toString('utf8'));
  } catch {
    return null; // tampered / stale / wrong key
  }
}

export function createOAuthClient() {
  return new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
}

/** Read and decrypt the session from the request cookie (or null). */
export function readSession(req) {
  const raw = req.cookies?.[COOKIE];
  if (!raw) return null;
  return decrypt(raw);
}

/** Merge `patch` into the current session and write it back as a cookie. */
export function saveSession(req, res, patch) {
  const next = { ...(readSession(req) || {}), ...patch };
  res.cookie(COOKIE, encrypt(next), cookieOptions);
  return next;
}

/** Clear the session cookie. */
export function clearSession(res) {
  res.clearCookie(COOKIE, { ...cookieOptions, maxAge: undefined });
}

/**
 * Build an authenticated OAuth2 client from the session. Because the access
 * token may be refreshed mid-request, we persist any refreshed tokens straight
 * back into the cookie on the current response.
 */
export function clientForSession(req, res) {
  const session = readSession(req);
  if (!session?.tokens) return null;
  const client = createOAuthClient();
  client.setCredentials(session.tokens);
  client.on('tokens', (tokens) => {
    const merged = { ...session.tokens, ...tokens };
    delete merged.id_token; // keep the cookie small; we only needed the email once
    saveSession(req, res, { tokens: merged });
  });
  return client;
}
