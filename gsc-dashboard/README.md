# Qualent Search Console Dashboard

A full-stack analytics dashboard for **Google Search Console**. It shows which
keywords/queries and pages are ranking and earning clicks, defaults to the
**United States** market and **clicks** as the primary metric, and includes an
**alert engine** that flags any page whose impressions have dropped for
**7 consecutive days** (configurable).

It ships with a realistic **demo dataset** so it runs immediately — no Google
account required. Add OAuth credentials to go **live** against your real
property.

---

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | KPI cards (Clicks, Impressions, CTR, Avg. Position) with period-over-period deltas, a clicks/impressions trend chart, and top-10 queries & pages. |
| **Queries** | Sortable, searchable table of every query — clicks, impressions, CTR, position. Defaults to US, sorted by clicks. |
| **Pages** | Same breakdown per landing page. |
| **Alerts** | Pages with impressions falling for N consecutive days (default 7). Severity (critical / warning / watch), peak→now change, and an impressions sparkline. Threshold is adjustable. |
| **Settings** | Connect Google Search Console (OAuth), pick a property, and review defaults. |

Every view respects the **country filter** (default United States) and the
**date range** (7 / 28 / 90 days).

---

## Architecture

```
gsc-dashboard/
├── server/        Node + Express API
│   └── src/
│       ├── index.js          app entry, CORS, error handling
│       ├── config.js         env config + "is Google configured?" flag
│       ├── routes/auth.js     Google OAuth flow (read-only scope)
│       ├── routes/api.js      /overview /queries /pages /alerts /status
│       ├── gscProvider.js     live Search Console API client
│       ├── mockProvider.js    deterministic demo data (same interface)
│       ├── alertEngine.js     consecutive-decline detection
│       └── store.js           session + token store
└── client/        React + Vite + TypeScript
    └── src/
        ├── App.tsx            shell, nav, filters, OAuth callback handling
        ├── views/             Dashboard / Queries / Pages / Alerts / Settings
        ├── components/        Sidebar, TopBar, FiltersBar, StatCard, MetricTable, charts
        └── api.ts             typed fetch client
```

The backend exposes one provider interface implemented twice — `mockProvider`
(demo) and `gscProvider` (live). Routes auto-select live when a Google account
is connected and a property is chosen; otherwise demo data is served. The
frontend code is identical in both modes.

---

## Running locally

**Prerequisites:** Node.js 18+

```bash
cd gsc-dashboard

# install both server and client deps
npm run install:all

# (optional) configure live Google data — otherwise demo mode is used
cp server/.env.example server/.env   # then fill in the Google OAuth values

# start API (:4000) and dashboard (:3000) together
npm run dev
```

Open **http://localhost:3000**. The Vite dev server proxies `/api` to the
backend, so cookies and OAuth work as same-origin.

---

## Connecting real Google Search Console data

1. Create an OAuth 2.0 **Web application** client in the
   [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Enable the **Google Search Console API** for the project.
3. Add this redirect URI to the client:
   `http://localhost:4000/api/auth/google/callback`
4. Put the client ID/secret in `server/.env` (copy from `.env.example`).
5. Restart the server, open the dashboard → **Settings → Connect Google Search
   Console**, approve access, and pick a verified property.

Only the read-only scope `webmasters.readonly` is requested.

---

## The 7-day impression-drop alert

The alert engine (`server/src/alertEngine.js`) pulls each page's daily
impressions for the selected market/range and measures the **day-over-day
decline streak ending on the most recent day**:

- **Critical** — streak ≥ threshold (default **7** consecutive days down)
- **Warning** — streak ≥ ~70% of the threshold
- **Watch** — a long decline streak exists earlier in the window

Each alert reports the peak vs. current impressions, the % change, the date
window, and a sparkline. The threshold is adjustable from the Alerts page and
defaults to 7 via `DEFAULT_DECLINE_DAYS`.
