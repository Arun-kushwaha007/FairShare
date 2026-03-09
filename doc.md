# FairShare — Production Launch Notes (March 2026)

## 1. Overview
FairShare is a pnpm/Turborepo monorepo built for collaborative expense sharing across Expo mobile, NestJS backend, and a Next.js marketing/dashboard experience. The stack is hard‑typed (TypeScript strict), backed by Prisma + Supabase PostgreSQL, Redis caching, and AWS S3 storage. JWT auth, refresh rotation, Google OAuth, and production observability are already wired together.

## 2. Infrastructure & Deployment
- **Terraform**: reusable modules (`vpc`, `ecs_cluster`, `ecs_service_backend`, `redis`, `s3_storage`, `cloudwatch_logs`) plus per‑env stacks (dev/staging/prod) deploy ECS Fargate backend, ElastiCache Redis, S3 buckets, and CloudWatch log groups. ECS service uses ALB health checks against `/health` and auto scaling (min/max caps).
- **Docker**: multi‑stage backend image with `HEALTHCHECK` hitting `/health`, Prisma migrations bundled, and runtime environment variables wired from `AppConfigService`.
- **CI/CD**:
  - `ci.yml`: pnpm + Turbo cache; jobs for typecheck, lint, tests, frontend builds, security audit, dependency review, coverage uploads, and Playwright e2e (guarded by `RUN_E2E`).
  - `deploy.yml`: on `main` builds/test -> docker image -> pushes to AWS ECR -> forces ECS service redeploy; image tagged with SHA + `latest`.
- **Scripts**: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm mobile:build` (EAS production AAB), `pnpm seed`, `pnpm --filter backend prisma:generate`.

## 3. Backend Implementation
- **Core runtime**: `/api/v1` prefix, global `ValidationPipe`, helmet, compression, CSRF on refresh + `/auth/csrf-token`, and structured request logging (method/path/status/duration plus Prometheus metrics via `observeApiRequest`). AppConfig enforces environment variables for Supabase, Redis, AWS, S3, Stripe, etc.
- **Health, metrics, observability**: `GET /health` reports DB + Redis status, `/metrics` exports Prometheus metrics, and OpenTelemetry NodeSDK auto-instrumentation starts on bootstrap with graceful shutdown.
- **Auth + security**:
  - Email/password + Google OAuth, refresh rotation stored hashed, secure `refresh_token` cookie (`httpOnly`, `secure`, `sameSite=strict`).
  - `csurf` middleware across refresh endpoints; `AuthController` provides `/csrf-token`.
  - Throttler limits auth/login/register to 10 req/min in addition to global 100/min.
- **Payments & settlements**:
  - Stripe-based `payments` module creates payment intents, stores idempotency keys, handles webhooks queued via BullMQ, and records settlements (duplicate guard + idempotency).
  - Payment webhook job ensures settlement is created once per intent.
- **Jobs + notifications**:
  - BullMQ queues for notification delivery, receipt processing, payment webhooks; workers publish Expo push notifications asynchronously (job retry/backoff configured).
  - `NotificationsService` now enqueues jobs, reads push tokens from Prisma, and retries chunked Expo requests.
- **Data integrity**:
  - Prisma schema now includes `Payment`, `Activity`, `PushToken`, `Balance`, `Settlement`, etc., with indexes and soft delete awareness via `createdAt`.
  - Utilities `money.util.ts` and `sanitize.util.ts` ensure BigInt sums and protected text.
  - Validation ensures splits add to total, payer/members exist, expenses capped at 1,000,000 cents, settlements prevent duplicates, invites sanitize email, and idempotency key support in payments/settlements.

## 4. Frontend & UX (priority on polish + flow)
### Mobile Experience
- **Navigation**: auth stack (`Login`, `Register`), main stack with `Dashboard`, tab navigator (`Groups`, `Activity`, `Profile`), and deep links to `GroupDetail`, `GroupMembers`, `AddExpense`, `ExpenseDetail`, `SettleUp`, `Settings`.
- **Dashboard (HomeScreen)**: quick insights, activity preview, quick add expense, quick settle suggestion, and floating action button linking to `AddExpenseScreen`.
- **Group detail**:
  - Sections framed by time (`Today`, `This Week`, `Older`) with payer avatars, participant chips, swipe-to-delete (modal confirm), and member avatars that show balance summaries on tap.
  - Member roster view with invite-by-email action and inline loading states/empty states backed by themed illustrations (`no-groups`, `no-expenses`, `no-activity`).
- **Add Expense workflow**:
  - Real group members loaded, payer + participant selection, split selector supporting equal, exact, and percentage splits with inline validation.
  - `SplitSelector` component and shared `split.ts` utility manage calculations; `money` utilities ensure BigInt-friendly arithmetic.
- **Settle Up flow**:
  - Greedy simplify data drives buttons; UPI deeplink (`upi://pay?...`) plus “Mark as paid” button after payment ensures manual checkoff; success animation via Lottie.
  - Offline + queue backed by `offlineQueue` using NetInfo; API wrappers mark retried POSTs accordingly.
- **Theming & UI polish**:
  - Design system with responsive spacing/typography/colors (`#4F46E5`, `#F8FAFC`, Inter), button variants (primary/secondary/danger) with press-scale animation via Reanimated.
  - Custom UI primitives (`Avatar`, `Button`, `Card`, `MoneyText`, `LoadingSpinner`, `EmptyState`) built on react-native-paper plus MaterialCommunityIcons.
  - Animations for settlements (Lottie), skeleton loaders, haptic feedback, toast system, and offline-safe retry notices.
- **Networking**:
  - Axios layer logs requests/responses, attaches JWT, measures latency (`trackApiLatency`), reports high latency to Sentry, and queues POSTs when offline.
  - SecureStore persists tokens; Expo Notifications + Sentry SDK initialized in App.tsx; realtime socket handled via `socket.io-client` with rooms by group.

### Web Experience
- Authenticated dashboard under `/dashboard` showing group list, balances, and recent activity (reuses API contracts).
- Marketing + documentation pages (`/features`, `/pricing`, `/about`, `/login`) include TailwindCSS + Framer Motion cards, hero with CTA, FAQ, newsletter form, and metadata for SEO.

## 5. Testing & CI
- Backend: Jest suites cover groups, balances, settlements (integration + unit), expenses, simplify, activity, notifications; newly updated mocks support duplicate-guard logic.
- Mobile: jest-expo tests for `SplitSelector`, `AddExpenseScreen`, `GroupListScreen`, `LoginScreen`.
- Playwright e2e: registration → login → group → invite → expense → settlement → activity assertions.
- CI pipeline (see `.github/workflows/ci.yml`) ensures typecheck, lint, tests, builds, security audit, dependency review, coverage artifacts, and Playwright run (conditioned).

## 6. Logging & Observability
- Backend structured logging (RequestLogger + Sentry + Prometheus). Observability controller exposes metrics for API latency, error count, expense creation, active users.
- Mobile logs prefixed `[api]`, `[auth-ui]`, `[auth]`; Sentry receives high-latency warnings and slow-screen traces.

## 7. Environment & Secrets
- `.env.example` contains Supabase, JWT secrets, Google OAuth, Redis, CORS, AWS, S3, Stripe, Sentry keys.
- Mobile `.env.example` covers `EXPO_PUBLIC_API_URL`, Sentry, and S3 base URL.
- `AppConfigService` enforces `mustGet` for mandatory vars, while mobile/respective services resolve host addresses for Expo Go vs LAN dev.

## 8. Next Steps
1. Wire Expo notification tokens to backend + real push service (currently logged through Expo queue).
2. Migrate AWS SDK usage to v3 and align Terraform CDK if needed.
3. Document E2E setup (`RUN_E2E=true`) and release Playwright builds in CI.
