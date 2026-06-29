import dotenv from 'dotenv';

dotenv.config();

const {
  PORT = '4000',
  CLIENT_URL = 'http://localhost:3000',
  GOOGLE_CLIENT_ID = '',
  GOOGLE_CLIENT_SECRET = '',
  GOOGLE_REDIRECT_URI = 'http://localhost:4000/api/auth/google/callback',
  SESSION_SECRET = 'dev-secret-change-me',
  FORCE_DEMO = 'false',
} = process.env;

export const config = {
  port: Number(PORT),
  clientUrl: CLIENT_URL,
  google: {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
    // Read-only access to Search Console + basic profile.
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  },
  sessionSecret: SESSION_SECRET,
  forceDemo: FORCE_DEMO === 'true',
  // Secure cookies when the public URL is HTTPS (Vercel/Netlify/prod).
  cookieSecure: CLIENT_URL.startsWith('https://'),
};

// We can only talk to the real Google API if OAuth credentials exist
// and demo mode hasn't been forced on.
export const googleConfigured =
  Boolean(config.google.clientId && config.google.clientSecret) && !config.forceDemo;
