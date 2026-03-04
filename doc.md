# FairShare Beta Documentation

## 1. Project Overview
FairShare is a pnpm + Turborepo monorepo for shared-expense management with:
- Mobile: Expo React Native (TypeScript strict)
- Backend: NestJS (TypeScript strict)
- Web: Next.js (marketing + auth entry pages)
- Database: PostgreSQL (Supabase-compatible) via Prisma
- Cache: Redis
- Storage: AWS S3 (presigned upload URLs)
- Monitoring: Sentry (backend + mobile)

Core architecture guarantees:
- Shared DTO contracts from `packages/shared-types`
- All money persisted as `BigInt` cents in DB
- Backend-only balance computation
- Transactional writes for critical financial flows

---

## 2. Monorepo Layout
- `apps/backend`
- `apps/mobile`
- `apps/web`
- `packages/shared-types`
- `infra/terraform`
- `.github/workflows`
- `scripts`

Key root files:
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.base.json`
- `doc.md`

---

## 3. Shared Types (`packages/shared-types`)
Centralized contracts used by backend and mobile:
- Auth DTOs
- Group and membership DTOs
- Expense and split DTOs
- Paginated expense response DTO (`items`, `nextCursor`)
- Balance DTOs
- Settlement DTOs
- Receipt URL DTOs
- Activity DTOs + activity type union
- Push token registration DTO

No DTO duplication across apps.

---

## 4. Backend (NestJS)

### 4.1 Core Runtime
- Global API prefix: `/api/v1`
- Global validation pipe enabled
- CORS configured from env
- Helmet enabled
- Compression + cookie-parser enabled
- Throttling enabled globally via `@nestjs/throttler`
  - Limit: 100 requests / 60 seconds / IP

### 4.2 Security
- JWT auth with access + refresh tokens
- Refresh token rotation persisted in DB (`refresh_tokens`)
- Refresh cookie set with:
  - `httpOnly: true`
  - `secure` in production
  - `sameSite: 'lax'`
  - path-scoped to auth refresh route
- Rate limiting guard active globally

### 4.3 Observability
- Backend Sentry integration via `@sentry/node`
- Captures:
  - unhandled rejections
  - uncaught exceptions

### 4.4 Prisma Schema (beta)
Models:
- `User`
- `Group`
- `GroupMember`
- `Expense`
- `Split`
- `Balance`
- `Settlement`
- `Receipt`
- `RefreshToken`
- `Activity`
- `PushToken`

Important indexes:
- `GroupMember.groupId`
- `GroupMember.userId`
- `Expense.groupId`
- `Expense.createdAt`
- `Expense(groupId, createdAt)` composite
- `Split.expenseId`
- `Balance.groupId`
- `Balance.userId`
- `Settlement.groupId`

### 4.5 Modules and Features
Implemented modules:
- `auth`
- `users`
- `groups`
- `expenses`
- `balances`
- `settlements`
- `simplify`
- `receipts`
- `activity`
- `notifications`
- `redis`
- `s3`
- `common`

#### Auth endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `POST /api/v1/auth/refresh`

#### Groups endpoints
- `POST /api/v1/groups`
- `GET /api/v1/groups`
- `GET /api/v1/groups/:id`
- `POST /api/v1/groups/:id/invite`

#### Expenses endpoints
- `POST /api/v1/groups/:id/expenses`
- `GET /api/v1/groups/:id/expenses?page=1&limit=20`
- `GET /api/v1/expenses/:id`
- `PATCH /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`

#### Balances endpoint
- `GET /api/v1/groups/:id/balances`

#### Settlements endpoint
- `POST /api/v1/groups/:id/settlements`

#### Receipts endpoint
- `POST /api/v1/expenses/:id/receipt-url`

#### Activity endpoint
- `GET /api/v1/groups/:id/activity`
  - returns latest 50 events sorted by `createdAt DESC`

#### Users endpoint
- `POST /api/v1/users/push-token`

### 4.6 Financial Integrity Rules
Expense creation safety checks:
- total amount must be positive
- split sum must exactly equal `totalAmountCents`
- actor must be group member
- payer must be group member
- all split users must be group members

Settlement safety checks:
- amount must be positive
- actor must be group member
- payer/receiver must be group members

Invite safety checks:
- actor membership required
- duplicate invite/member creation blocked

### 4.7 Transactional Flows
Expense create transaction:
1. insert expense
2. insert split rows
3. update balances
4. insert activity event

Settlement create transaction:
1. insert settlement
2. update balances
3. insert activity event

### 4.8 Balance Logic
For payer A and owing user B:
- `B -> A` negative amount
- `A -> B` positive amount

### 4.9 Simplification Algorithm
`SimplifyService`:
- fetch balances by group
- compute net position per user
- separate debtors/creditors
- greedy matching for settlement suggestions

### 4.10 Activity Feed Events
Supported types:
- `expense_created`
- `expense_updated`
- `expense_deleted`
- `settlement_created`
- `member_joined`
- `member_invited`

Logged inside group/expense/settlement flows.

### 4.11 Notifications Infrastructure
- `NotificationsService.sendPushNotification(userIds, payload)` abstraction
- currently logs payload (stub for real push provider)
- triggered for:
  - new expense
  - settlement
  - group invite

### 4.12 Redis Caching
Cached keys (TTL 120s):
- group balances
- group members
- group expense summary

Invalidation on expense/settlement/invite mutations.

### 4.13 S3 Receipts
- Presigned upload URL generation
- File key pattern:
  - `receipts/{groupId}/{expenseId}/{uuid}.{ext}`

---

## 5. Mobile (Expo)

### 5.1 Stack
- Expo SDK 54
- React Navigation (stack + tabs)
- Zustand stores
- React Hook Form
- Axios API layer
- React Native Paper UI
- Reanimated + Gesture Handler
- Expo Haptics
- Expo Notifications
- Expo Image
- Sentry Expo
- Skeleton placeholder support

### 5.2 Theme System
`app/theme`:
- `colors.ts`
- `spacing.ts`
- `typography.ts`
- `theme.ts`

Primary styles:
- primary color `#4F46E5`
- background `#F8FAFC`

### 5.3 Reusable UI Components
`app/components/ui` includes:
- `Button`
- `Card`
- `Avatar`
- `ListItem`
- `MoneyText`
- `EmptyState`
- `LoadingSpinner`
- `GlobalToast`
- `SkeletonList`

### 5.4 Navigation
Auth stack:
- `LoginScreen`
- `RegisterScreen`

Main tabs:
- `Home`
- `Groups`
- `Activity`
- `Profile`

Additional screens:
- `GroupDetailScreen`
- `AddExpenseScreen`
- `ExpenseDetailScreen`
- `SettleUpScreen`
- `SettingsScreen`

### 5.5 Mobile Services
`app/services`:
- `api.ts` (axios + auth header interceptor)
- `auth.service.ts`
- `group.service.ts`
- `expense.service.ts`
- `settlement.service.ts`
- `user.service.ts` (push token registration)

### 5.6 State Stores
- `authStore`
- `groupStore`
- `expenseStore`
- `toastStore`

### 5.7 UX Features
- pull-to-refresh
- loading states
- empty states (groups/expenses/activity)
- haptics
- toasts
- subtle reanimated effects
- FAB on group detail (`plus-circle`)
- infinite scroll on activity screen
- receipt preview + full-screen modal image viewer

### 5.8 Push Registration
On authenticated app usage:
- request notification permissions
- fetch Expo push token
- post token to backend `/users/push-token`

### 5.9 Mobile Monitoring
- `sentry-expo` initialized in `App.tsx`

---

## 6. Web (Next.js)

### 6.1 Stack
- Next.js App Router
- Tailwind CSS
- Framer Motion

### 6.2 Pages
- `/` landing page with:
  - hero
  - screenshots section
  - animated feature cards
  - feature comparison table
  - FAQ
  - newsletter signup block
  - footer CTA links
- `/features`
- `/pricing`
- `/about`
- `/login`

### 6.3 SEO
`app/layout.tsx` includes metadata:
- title
- description
- keywords
- Open Graph basics

---

## 7. CI/CD
Workflow: `.github/workflows/ci.yml`

Pipeline includes:
1. checkout
2. pnpm setup
3. node setup (with pnpm cache)
4. install dependencies
5. prisma generate (backend)
6. typecheck (via lint command)
7. lint
8. tests
9. backend coverage run
10. coverage artifact upload
11. build backend/mobile/web

---

## 8. Developer Tooling

### 8.1 Seed Script
- Root command: `pnpm seed`
- Backend command: `pnpm --filter backend seed`
- Seed file: `apps/backend/prisma/seed.ts`

Seed creates:
- 3 users
- 2 groups
- 10 expenses
- baseline balances
- activity rows

### 8.2 Prisma Commands
- `pnpm --filter backend prisma:generate`
- `pnpm --filter backend prisma:migrate --name <migration_name>`

---

## 9. Environment Variables
From `.env.example`:
- `SUPABASE_DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIS_URL`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`
- `SENTRY_DSN`
- `EXPO_PUBLIC_SENTRY_DSN`

---

## 10. Commands

Install:
```bash
pnpm install
```

Development:
```bash
pnpm dev
```

Build:
```bash
pnpm build
```

Test:
```bash
pnpm test
```

Seed:
```bash
pnpm seed
```

Backend Prisma bootstrap:
```bash
pnpm --filter backend prisma:generate
pnpm --filter backend prisma:migrate --name beta_update
```

---

## 11. Current Status
FairShare is now at production-ready beta scaffold level with:
- hardened backend validation and security
- activity feed system (backend + mobile UI)
- push notification infrastructure
- pagination + caching improvements
- receipt viewing UX
- Sentry integration
- improved web marketing experience
- stronger CI and dev tooling

Remaining future production work can focus on:
- real push dispatch provider integration
- live receipt upload flow and signed download URLs
- deeper integration/e2e tests
- stronger domain authorization policies per endpoint
