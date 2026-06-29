import { google } from 'googleapis';
import { config } from './config.js';

/**
 * Tiny in-memory session store.
 *
 * Maps a signed cookie session id -> { tokens, email, siteUrl }. This is fine
 * for a single-user dashboard / demo; swap for Redis or a DB to go multi-user.
 */
const sessions = new Map();

export function createOAuthClient() {
  return new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUri
  );
}

export function getSession(sid) {
  if (!sid) return null;
  return sessions.get(sid) || null;
}

export function setSession(sid, data) {
  const existing = sessions.get(sid) || {};
  sessions.set(sid, { ...existing, ...data });
  return sessions.get(sid);
}

export function clearSession(sid) {
  sessions.delete(sid);
}

/** Build an authenticated OAuth2 client for a session, or null. */
export function clientForSession(sid) {
  const session = getSession(sid);
  if (!session || !session.tokens) return null;
  const client = createOAuthClient();
  client.setCredentials(session.tokens);
  // Persist refreshed tokens back into the session.
  client.on('tokens', (tokens) => {
    const merged = { ...session.tokens, ...tokens };
    setSession(sid, { tokens: merged });
  });
  return client;
}
