# E-Cell News — Shiv Nadar University

A startup-news aggregator for the **Shiv Nadar University Entrepreneurship Cell**.
It pulls stories from a set of startup RSS feeds on a schedule, stores them in a
[Turso](https://turso.tech) (libSQL) database, and serves them through a fluid,
glassmorphic Next.js interface with category filtering and live search.

## Tech stack

- **Next.js (App Router)** — full-stack framework, deployed on Vercel
- **Tailwind CSS v4** — styling, with a custom royal-blue "Fluent" design system
- **Framer Motion** — page/micro-interactions (filter pill, card stagger, splash)
- **Lucide React** — supplementary icons
- **Turso / libSQL** (`@libsql/client`) — serverless SQLite database
- **rss-parser** — feed ingestion
- **Vercel Cron** — scheduled ingestion (daily on Hobby, up to every 4h on Pro)

## How it works

```
RSS feeds ──(cron, daily)──> /api/cron/fetch-news ──> ingestFeeds() ──> Turso
                                                                              │
Browser ──> app/page.tsx ──(fetch)──> /api/news ──> getArticles() ───────────┘
```

1. **Ingestion** — `lib/ingest.ts` fetches each feed, applies a relevance gate,
   auto-categorizes (Funding / AI / Web3 / General), extracts a thumbnail, and
   upserts into Turso (deduped by article URL).
2. **Storage** — `lib/db.ts` owns the libSQL client and a self-healing,
   non-destructive schema migration (`ensureSchema`).
3. **API** — `app/api/news/route.ts` reads the newest articles; the response is
   CDN-cached for 5 minutes.
4. **UI** — `app/page.tsx` fetches once, then filters client-side by category
   (`useMemo`) and search query, animating changes with Framer Motion.

## Project structure

```
app/
  layout.tsx              Root layout, Inter font, metadata
  page.tsx                Client page: state, filtering, search
  globals.css             Tailwind v4 + design tokens (--color-royal, etc.)
  api/
    news/route.ts         GET live articles from Turso (CDN-cached 5 min)
    cron/fetch-news/route.ts   Cron endpoint — runs RSS ingestion (CRON_SECRET-gated)
components/
  GlassHeader.tsx         Sticky glass nav + expanding search field
  FilterCarousel.tsx      Category chips with shared-layout active pill
  NewsCard.tsx            Article card (hover lift, staggered enter/exit)
  FeedLayout.tsx          Responsive 1/2/3-col grid + AnimatePresence
  LoadingScreen.tsx       Pulsing-logo splash
  ECellLogo.tsx           Logo (renders /public/ecell-logo.svg)
  ArrowIcon.tsx           Geometric arrow for "Read full story" / back
lib/
  types.ts                Article type + CATEGORIES
  db.ts                   Turso client, schema migration, queries
  ingest.ts               RSS fetch, relevance, categorization, image extract
public/
  ecell-logo.png          Logo asset (256px-optimized)
vercel.json               Cron schedule (daily)
```

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
TURSO_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
CRON_SECRET=your-random-secret   # openssl rand -hex 32
```

Create a database and token with the [Turso CLI](https://docs.turso.tech):

```bash
turso db create news-aggregator
turso db show news-aggregator --url
turso db tokens create news-aggregator
```

The `articles` table is created automatically on the first cron/news request —
no manual migration needed.

### 3. Run

```bash
npm run dev          # http://localhost:3000
```

### 4. Seed the database

The feed is empty until the cron runs. Trigger ingestion manually:

```bash
# If CRON_SECRET is unset locally, the endpoint is open:
curl http://localhost:3000/api/cron/fetch-news

# If CRON_SECRET is set:
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/fetch-news
```

You should get a JSON summary (`inserted`, `skippedExisting`, `errors`, …).
Reload the page to see the stories.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also typechecks) |
| `npm run start` | Serve the production build |

## The logo

`components/ECellLogo.tsx` renders `public/ecell-logo.png` (a 256px-optimized
copy of the official logo). To swap it, replace that file (keep it small —
~256px is plenty for the header/splash) or update `LOGO_SRC` in `ECellLogo.tsx`.

The logo appears in the header and the loading splash — both driven by that one file.

## Configuration knobs

- **RSS sources** — edit `RSS_FEEDS` in `lib/ingest.ts`.
- **Categories** — edit `CATEGORIES` in `lib/types.ts` and the matching
  `CATEGORY_RULES` in `lib/ingest.ts`.
- **Cron cadence** — edit the `schedule` in `vercel.json` (cron syntax).
- **Feed freshness** — the `Cache-Control` header in `app/api/news/route.ts`.

## Deploying to Vercel

1. Push the repo and import it in Vercel.
2. Set `TURSO_URL`, `TURSO_AUTH_TOKEN`, and `CRON_SECRET` in **Project Settings →
   Environment Variables**.
3. The cron in `vercel.json` (`0 0 * * *`, daily) runs automatically.

> **⚠️ Cron cadence:** `vercel.json` defaults to a **daily** schedule
> (`0 0 * * *`) because Vercel's Hobby tier only runs cron jobs **once per day**.
> To ingest more frequently (e.g. every 4 hours, `0 */4 * * *`), upgrade to the
> **Pro plan** and edit the schedule.

> **Security:** always set `CRON_SECRET` in production. If it's unset, the
> `/api/cron/fetch-news` endpoint is publicly callable.
