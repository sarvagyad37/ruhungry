# Deploy to Vercel (with KV + Cron)

This project serves Rowan Engage "Free Food" events via a cached public API and a small web UI.

## 1) Prerequisites
- Vercel account
- GitHub repo connected (this repo)

## 2) Import the repo
1. Go to Vercel → New Project → Import Git Repository → select this repo.
2. Framework preset: Next.js (auto-detected).

## 3) Environment variables (Project → Settings → Environment Variables)
- `REFRESH_SECRET` = a long random string (used by `/api/refresh`)
- `ENGAGE_BASE` = `https://rowan.campuslabs.com/engage`

Create in both Preview and Production.

## 4) Add Vercel KV integration
1. Vercel Dashboard → Integrations → Add “Vercel KV” to this project.
2. Accept defaults. This injects `KV_*` env vars at build/runtime.

## 5) Deploy
- Trigger the initial deployment (or push to `main`).

## 6) Create a Cron Job (Project → Settings → Cron Jobs)
1. Add job:
   - Schedule: `*/10 * * * *` (every 10 minutes)
   - URL Path: `/api/refresh?secret=YOUR_REFRESH_SECRET`
   - Region: same as project
2. Save, then "Run Now" once to warm the cache.

## 7) Test
- `GET https://<your-domain>/api/free-food` → should return JSON with events
- Visit site root to see the list UI.

## Notes
- The app only lists events where `benefitNames` contains `"Free Food"`, `visibility` is `Public`, and `status` is `Approved`, with `endsOn >= now`.
- KV is required in production for persistent cache. Local dev falls back to in-memory.


