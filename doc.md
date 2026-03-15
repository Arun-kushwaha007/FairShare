# FairShare Project Status

Last updated: March 15, 2026

## Snapshot
- Monorepo with NestJS API, Expo mobile client, and a Next.js marketing site managed via Turbo + pnpm.
- Core expense, settlement, receipt, notification, realtime, and payment primitives are implemented server-side with Prisma/PostgreSQL (Supabase URL) and Redis/BullMQ.
- Mobile app ships full flows (auth, groups, expenses, settle-up, activity, profile/settings) with offline queueing, push tokens, realtime sockets, and UPI deep-link helper; UI built with React Native Paper + Reanimated.
- Web app is currently a single-page marketing/landing experience with Framer Motion; no dashboard/auth wiring yet.
- Observability (Sentry, OpenTelemetry, Prometheus metrics) and security hardening (helmet, throttling, CSRF on refresh, JWT + refresh cookies) are wired in backend startup.

## Project Structure
- apps/backend — NestJS service exposing REST + WebSocket APIs; background jobs via BullMQ.
- apps/mobile — Expo Router/React Native client with feature screens and state stores (Zustand).
- apps/web — Next.js 15 site styled with Tailwind + Framer Motion animations.
- packages/shared-types — DTOs and response contracts shared across apps.
- infra/terraform — Terraform skeleton for AWS (ECS, RDS, S3) deployment.

## Backend (apps/backend)
### Major modules & responsibilities
- Auth: register/login/google, refresh tokens (httpOnly cookie), CSRF token endpoint.
- Users: `GET /users/me`, `POST /users/push-token` to register Expo tokens.
- Groups: CRUD-ish flows (`POST /groups`, `GET /groups`, `GET /groups/:id`, members, invite, per-user/group summaries).
- Expenses: create/list/update/delete per group; pagination via cursor+limit; detail fetch.
- Balances: `GET /groups/:id/balances` to expose pairwise balances.
- Simplify: `GET /groups/:id/simplify` returns settlement suggestions (used by mobile settle-up).
- Settlements: `POST /groups/:id/settlements` with optional `x-idempotency-key`.
- Receipts: `POST /expenses/:id/receipt-url` returns presigned S3 upload URL and records receipt key.
- Activity: user and group feeds with cursor pagination.
- Payments: `POST /payments/create-intent` (Stripe PaymentIntent) and `POST /payments/webhook` (queues handling); settlements are recorded from successful webhooks.
- Realtime: Socket.IO gateway with `join_group`/`leave_group` rooms; emits expense/settlement/group-member events per group.
- Notifications: Expo push delivery via Redis pub/sub + BullMQ retries; invalid tokens are cleaned up.
- Health/Observability: `/health` checks PostgreSQL + Redis; `/metrics` exposes Prometheus text; OpenTelemetry auto-instrumentation on boot.

### Data model (Prisma)
- Users with JWT/refresh tokens, push tokens, activities.
- Groups with members (roles), expenses (splits), balances, settlements, receipts, invites, payments, activities.
- Expenses store cent-precision totals plus per-user splits; receipts are 1:1 with expenses.
- Settlements & payments support idempotency keys; payments map to Stripe PaymentIntents.

### Integrations & infrastructure
- PostgreSQL via `SUPABASE_DATABASE_URL`.
- Redis for queues + pub/sub + throttling state.
- AWS S3 (AWS SDK v3) for receipt uploads (presigned PUT URLs).
- Stripe (v18 SDK) for PaymentIntents; webhook signature enforced when `STRIPE_WEBHOOK_SECRET` set.
- Google OAuth via `passport-google-oauth20` alongside email/password.
- Expo push notifications via `expo-server-sdk`.
- Security middleware: helmet, compression, cookie-parser, CSRF on refresh/csrf-token routes, Nest ValidationPipe (whitelist/forbid), global throttling, CORS allowlist.

### Background jobs (BullMQ)
- Notification delivery with exponential backoff and invalid-token cleanup.
- Receipt processing placeholder queue hook (currently enqueues on presign, no downstream worker in repo).
- Payment webhook handling queued with retries to shield Stripe endpoint.

### Testing
- Unit/integration Jest suites for activity, balances, expenses (service + integration), settlements (service + integration), receipts (service + integration), payments, simplify, users, notifications.

## Mobile (apps/mobile)
- Stack: Expo SDK 54, React Native 0.81, React Navigation, React Native Paper, Reanimated, Lottie, Zustand stores, Axios client, Socket.IO client, Expo Notifications, SecureStore, NetInfo.
- UX flows: onboarding (login/register), group list/detail, members, add expense, expense detail, activity feed, settle-up suggestions, profile, settings, toasts, skeleton placeholders.
- Offline: SecureStore-backed offline POST queue with automatic flush when connectivity returns; queues group expense creation, settlements, and invites.
- Networking: Axios client auto-injects bearer token from SecureStore; base URL auto-derives from Expo host or `EXPO_PUBLIC_API_URL`; logs in dev; latency tracked; retry queue marks requests with `x-offline-retry` to avoid loops.
- Realtime: connects to Socket.IO after auth for group events.
- Push: registers device tokens and posts to `/users/push-token`.
- Payments/settle-up UX: uses simplify suggestions; triggers UPI deep links for payers then marks settlement via API (does not yet surface Stripe PaymentIntent flow in-app).
- Visuals: gradient/neo styling, animations on hero cards/actions, Avatar initials, haptic feedback hooks present.
- Tests: basic Jest + testing-library specs for login, group list, add expense screens; TypeScript lint via `tsc --noEmit`.

## Web (apps/web)
- Next.js 15 single-page marketing site with Framer Motion animations, Lucide icons, Tailwind utility styles.
- Sections: hero CTA, feature grid, comparison table, FAQ/dev log, newsletter form, footer links.
- No auth or API wiring yet; currently a static experience suitable for marketing/landing only.

## Shared Types (packages/shared-types)
- Zod/TypeScript DTOs for auth payloads, expenses, balances, settlements, receipts, activity feeds, payments, notifications; consumed by backend controllers and mobile client.

## DevOps & Tooling
- Scripts: `pnpm dev|dev:backend|dev:mobile|dev:web`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm e2e` (Playwright), `pnpm seed`.
- Docker: backend Dockerfile; `docker-compose.yml` for local Postgres/Redis/S3? (check services before use).
- Monitoring: Sentry DSN + OTEL hooks; Prometheus metrics endpoint.
- Infra: Terraform stubs for AWS ECS/RDS/S3; CI assumed via GitHub Actions (see README claim) though pipeline files not present in repo root.

## Known Gaps / Risks
- Web app is marketing-only; product dashboard, auth, and API integration are not implemented.
- Payments: mobile flow currently bypasses Stripe; settles via UPI link + manual settlement API. Stripe PaymentIntent UX is not exposed to clients yet.
- Receipt processing queue lacks worker implementation; uploads are stored but no OCR/parsing pipeline exists.
- Offline queue can replay POSTs without deduplication beyond backend idempotency keys; ensure idempotency keys are supplied for settlements/payments when adding clients.
- Expo SDK 54 with React Native 0.81/React 19 stack may emit peer warnings; verify compatibility before release builds.
- CI configuration for lint/test/e2e is referenced but not included in the repo snapshot.

## Next Steps
1. Decide on in-app payment path: surface Stripe PaymentIntent client flow or keep UPI-only and disable PaymentIntent endpoint if unused.
2. Implement receipt-processing worker (OCR or at least validation) for queued jobs; expose receipt retrieval in UI.
3. Build authenticated web dashboard (groups/expenses/settlements) reusing shared-types + backend APIs.
4. Add end-to-end tests (Playwright) for critical flows: auth, expense creation, settlement, receipt upload.
5. Tighten mobile offline/idempotency by attaching idempotency keys and surfacing retry status to users.
6. Add CI pipeline files (GitHub Actions) to run lint/test/build on PRs and publish metrics artifacts.
