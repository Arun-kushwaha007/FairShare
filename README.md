# FairShare

A production-grade monorepo for collaborative expense sharing across mobile, web, and backend services.

## Overview
FairShare simplifies shared living and group travel by providing accurate splits, real-time activity, and fast settlements. This repository contains a fully wired backend API, an Expo-powered mobile app, and a Next.js web dashboard.

## What Is Implemented

### Mobile app
- Authentication, registration, and profile management
- Group creation, member management, and invitations
- Expense creation (equal, exact, percentage splits)
- Expense details with receipt preview/upload flow
- Group activity timeline with pagination
- Settlement flow with UPI deep link and mark-paid
- Theme switching (light, dark, system)

### Web dashboard
- Authentication, registration, and session handling
- Dashboard summary, recent activity, and quick actions
- Group list and group detail views
- Expense creation and receipt upload
- Member invitations
- Settlement suggestions with confirm flow
- Activity timeline with group filtering and pagination
- Profile and settings pages with light/dark/system theme

### Backend API
- NestJS API with Prisma + Supabase/Postgres
- BigInt-based split arithmetic for precise balances
- Redis for background jobs and caching
- S3 for receipt storage
- JWT auth with refresh tokens
- Stripe hooks (optional) and Sentry hooks (optional)

## Architecture

```
FairShare/
├── apps/
│   ├── backend/      # NestJS API Service
│   ├── mobile/       # Expo / React Native App
│   └── web/          # Next.js Marketing & Dashboard
├── packages/
│   └── shared-types/ # Shared TS interfaces
├── infra/            # Terraform modules
└── scripts/          # Automation and seeding
```

## Prerequisites
- Node.js 18+
- pnpm 8+
- Docker (for local Postgres and Redis)
- Optional: AWS S3 bucket for receipts

## Setup

### 1) Install dependencies
```
pnpm install
```

### 2) Configure environment variables
Create `.env` at the repo root (used by backend and shared tooling):

```
cp .env.example .env
```

Required variables in `.env`:
- `SUPABASE_DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `REDIS_URL`
- `CORS_ORIGINS` (include web + Expo dev URLs)

Optional but supported:
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`, `EXPO_PUBLIC_SENTRY_DSN`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

Mobile app `.env` (used by Expo):
```
cp apps/mobile/.env.example apps/mobile/.env
```
Set:
- `EXPO_PUBLIC_API_URL` (point to your API host, often your LAN IP)
- `EXPO_PUBLIC_S3_BASE_URL` (optional, public S3 base URL)

Web app environment:
```
cp apps/web/.env.example apps/web/.env.local
```
- `FAIRSHARE_API_URL` for server-side web requests
- `NEXT_PUBLIC_API_URL` for client-side web requests
- `FAIRSHARE_S3_BASE_URL` and `NEXT_PUBLIC_S3_BASE_URL` for receipt previews when using S3
- Defaults to `http://localhost:3001/api/v1` when API vars are unset

### 3) Start local infrastructure
```
docker-compose up -d
```

### 4) Run services
```
# All apps in parallel
turbo run dev --parallel

# Or individually
pnpm dev:backend
pnpm dev:web
pnpm dev:mobile
```

## Development Guide

### Backend
- API base URL: `http://localhost:3001/api/v1`
- Seed data: `pnpm seed`
- Ensure Redis and Postgres are running via Docker.

### Web
- Next.js dashboard and marketing pages
- Theme is controlled via `data-theme` and local storage
- Auth tokens for the web app are stored only in httpOnly cookies managed by `apps/web/app/api/auth/*`, `apps/web/src/lib/backend.ts`, and `apps/web/middleware.ts`
- `localStorage` is not part of the web auth flow
- Build: `pnpm --filter web build`

### Mobile
- Use Expo Go or a simulator
- Make sure `EXPO_PUBLIC_API_URL` points to a reachable host
- If using a device, replace `localhost` with your LAN IP

## Useful Commands

```
pnpm dev             # all apps
pnpm dev:web         # web only
pnpm dev:backend     # backend only
pnpm dev:mobile      # mobile only
pnpm lint            # lint all
pnpm test            # tests all
pnpm e2e             # Playwright
pnpm format          # Prettier
```

## Troubleshooting
- If mobile cannot reach the API, use your LAN IP in `EXPO_PUBLIC_API_URL`.
- If you see CORS errors, add the web and Expo URLs to `CORS_ORIGINS`.
- Receipt upload requires a configured S3 bucket and credentials.

## Contributing
See `CONTRIBUTING.md` for workflow and standards.

## Documentation
For architecture notes and deployment guidance, see `doc.md`.
