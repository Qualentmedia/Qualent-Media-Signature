// Vercel serverless entry point.
// All /api/* requests are routed here (see vercel.json rewrites) and handled
// by the same Express app used in local development.
import app from '../server/src/app.js';

export default app;
