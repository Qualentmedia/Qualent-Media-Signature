import app from './app.js';
import { config, googleConfigured } from './config.js';

// Local / long-running server entry point. (On Vercel, api/index.js imports
// the same app as a serverless function and this file is not used.)
app.listen(config.port, () => {
  const mode = googleConfigured ? 'LIVE (Google configured)' : 'DEMO (mock data)';
  console.log(`\n  GSC Dashboard API → http://localhost:${config.port}`);
  console.log(`  Data mode: ${mode}`);
  console.log(`  Allowed client origin: ${config.clientUrl}\n`);
});
