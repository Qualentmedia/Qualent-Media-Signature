// Netlify Functions entry point.
// Wraps the same Express app with serverless-http; netlify.toml redirects
// /api/* here, and app.js normalizes the function path back to /api/*.
import serverless from 'serverless-http';
import app from '../../server/src/app.js';

export const handler = serverless(app);
