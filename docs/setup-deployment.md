# FESTARI Estate Online Setup & Deployment Guide

This backend is Node.js/Express/Drizzle, not Django/Celery — there's no Redis, no Celery
worker/beat process, and no `manage.py`. If you've seen an older version of this doc, ignore the
Python/Docker-Compose instructions in it; the guide below matches what's actually in `server/`.

## Prerequisites
- **Node.js 20+** (both `server/` and `client/`)
- **PostgreSQL** — this repo's `.env.development` points at a Supabase-hosted instance by
  default; a local Postgres works too (see [Local Postgres](#local-postgres-alternative) below).
- **Docker** (optional) — only the backend has a `Dockerfile` today; the frontend runs via
  `npm run dev`/`next build && next start`, not a container.

## 1. Clone the Repository
```bash
git clone https://github.com/festarigroup/FESTARI_estate_online.git
cd FESTARI_estate_online
```

## 2. Backend Setup (`server/`)
```bash
cd server
npm install
cp .env.example .env.development
```

Fill in `.env.development`:
```env
PORT=3030
NODE_ENV=development
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
PASSWORD_SECRET=some-random-string
ENCRYPTION_SECRET=some-random-32-byte-string
ACCESS_TOKEN=jwt-access-secret
REFRESH_TOKEN=jwt-refresh-secret
API_BASE_URL=http://localhost:3030/api/v1
RESEND_API_KEY=re_...              # OTP emails
GOOGLE_CLIENT_ID=...                # Google Sign-In (web client id)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_AVATAR_BUCKET=avatars
SUPABASE_MEDIA_BUCKET=media
PAYMENT_SECRET_KEY=sk_test_...      # Paystack
PAYMENT_PUBLIC_KEY=pk_test_...
PAYSTACK_CALLBACK_URL=http://localhost:3030/api/v1/payments/webhook
SIMULATE_PAYSTACK_TRANSFERS=true
```
`ENCRYPTION_SECRET` has no fallback — the server refuses to boot without it (see
`src/app/utils/crypto.ts`).

```bash
npm run db:generate       # generate migrations from src/app/db/schema
npm run db:migrate:run    # apply them
npm run dev                # http://localhost:3030
```

**Windows note**: if the server hangs on boot with no error (never reaches "Server running on
port..."), it's IPv6 DNS resolution to the Supabase pooler, not a code bug — run with
`NODE_OPTIONS=--dns-result-order=ipv4first` (already set this way in `Dockerfile`; add it to your
local shell/npm script if running outside Docker on Windows).

## 3. Frontend Setup (`client/`)
```bash
cd client
npm install
```

```bash
cp .env.local.example .env.local
npm run dev   # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` is currently the only variable the frontend reads from the environment.

## 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3030
- **API Documentation (Swagger)**: http://localhost:3030/api-docs

## Docker (backend only)
```bash
docker-compose up -d      # builds server/Dockerfile, starts a local postgres too
docker-compose logs -f
docker-compose down
```
The root `docker-compose.yml` only defines `server` + a local `db` (Postgres) service — there's
no `client` service (no frontend `Dockerfile` exists yet) and no `redis`/`worker`/`beat`
services (nothing in this stack needs them). If `server/.env` points at a remote Supabase
`DATABASE_URL` (the repo's default), the local `db` container just sits there unused — point
`DATABASE_URL` at `postgresql://postgres:postgres@db:5432/festari_db` instead if you want the
compose Postgres to actually be used.

### Local Postgres alternative
If you'd rather not use Supabase for local dev, run just the `db` service and point
`DATABASE_URL` at it:
```bash
docker-compose up -d db
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/festari_db
```
You'll also need a Supabase project regardless, for file storage (`SUPABASE_URL` /
`SUPABASE_SERVICE_ROLE_KEY`) — there's no local-disk fallback for uploads.

## Production Deployment
- Build the server image (`docker build -t festari-backend ./server`) or deploy the compiled
  output (`npm run build && node dist/server.js`) to any Node host.
- Set `NODE_ENV=production` and every var listed in step 2 with production values.
- Point `PAYSTACK_CALLBACK_URL` at your real domain's `/api/v1/payments/webhook`.
- Run `npm run db:migrate:run` against the production database before starting the server.
- The frontend deploys as a standard Next.js app (Vercel or `next build && next start` behind
  any reverse proxy) — set `NEXT_PUBLIC_API_URL` to the deployed backend's URL at build time
  (Next.js inlines `NEXT_PUBLIC_*` vars at build, not at runtime).

## Monitoring & Maintenance
- **API health**: any successful response from `GET /api/v1/example` (or `/` for the root HTML
  page) confirms the server is up — there's no dedicated `/health` endpoint yet.
- **Logs**: `morgan("dev")` request logging to stdout; no log aggregation configured.
- **Scheduled job**: `expireSubscriptions` runs hourly via `node-cron`, in-process — check
  `server` logs for its output, there's no separate worker process to monitor.
- **Database backup**: standard `pg_dump`/managed-Postgres backups — nothing custom here, and
  Supabase's own backup tooling applies if you're using their hosting.

## Troubleshooting

**Database connection failed / hangs with no error on Windows** — see the IPv6 note in step 2.

**"ENCRYPTION_SECRET must be set" on boot** — add it to `.env`/`.env.development`; there's no
default.

**Registration succeeds but login always 403s** — the account isn't verified yet; complete
`POST /auth/verify-otp` first (see [api-reference.md](api-reference.md#auth--auth)).

**Images 404 or next/image throws "hostname not configured"** — `client/next.config.ts` allowlists
`*.supabase.co` for `next/image`; if you're using a different storage host, add it there.

**Payment webhooks not firing locally** — Paystack can't reach `localhost`; use a tunnel (ngrok or
similar) and point `PAYSTACK_CALLBACK_URL` at the tunnel URL, or set
`SIMULATE_PAYSTACK_TRANSFERS=true` to skip real Paystack calls in development.

## Security Checklist
- [ ] Set real (non-default) values for `ACCESS_TOKEN`, `REFRESH_TOKEN`, `PASSWORD_SECRET`, `ENCRYPTION_SECRET`
- [ ] `NODE_ENV=production` (switches error responses to the non-verbose prod shape)
- [ ] HTTPS in front of both the API and the frontend
- [ ] Paystack webhook signature verification is already enforced in code — just make sure the
      configured `PAYMENT_SECRET_KEY` matches your live Paystack account
- [ ] Rotate `SUPABASE_SERVICE_ROLE_KEY` if it's ever exposed client-side (it must never be — only
      `NEXT_PUBLIC_*` vars belong in the frontend)

## Support & Resources
- **API Reference**: [api-reference.md](api-reference.md)
- **Platform Overview**: [platform-overview.md](platform-overview.md)
- **Home Feed spec**: [home-feed-api-endpoints.md](home-feed-api-endpoints.md), [home-feed-db-schema.md](home-feed-db-schema.md)
