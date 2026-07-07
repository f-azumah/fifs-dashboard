# Personal Dashboard

A personal productivity dashboard built with Next.js 14 (App Router) and Prisma, backed by Neon Postgres.

## Features

- **Week view** — tasks organized by day, with a weekly focus + end-of-week reflection widget
- **Habits** — daily/weekly-target habits shown as a weekly grid, plus long-interval habits (e.g. protein treatments every 7 weeks, trims every 3 months) tracked with a "last done / next due" card

## Local setup

1. Copy `.env` and fill in your Neon connection strings:
   ```
   DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true"
   DIRECT_URL="postgresql://...?sslmode=require"
   ```
2. Install dependencies and run migrations:
   ```bash
   npm install
   npm run db:migrate
   npm run db:seed
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Deploying

Push to GitHub and import the repo in Vercel, or run `vercel` from the project root. Set `DATABASE_URL` and `DIRECT_URL` as environment variables in the Vercel project settings, then run `npx prisma migrate deploy` against the production database (or let it run as part of the build).
