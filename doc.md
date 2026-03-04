# FairShare Project Documentation

## Overview
FairShare is a pnpm workspace + Turborepo monorepo with:
- Mobile app: Expo React Native + TypeScript
- Backend API: NestJS + TypeScript
- Web app: Next.js + TypeScript
- Database: PostgreSQL (Supabase compatible) via Prisma
- Cache: Redis
- Storage: AWS S3 (presigned upload URLs)

Core rules implemented:
- TypeScript strict mode
- Shared contracts via `packages/shared-types`
- Money in cents as `BigInt` in database
- Backend handles balance computation
- Transactional writes for expense and settlement flows

---

## Monorepo Structure
- `apps/backend`: NestJS API
- `apps/mobile`: Expo React Native app
- `apps/web`: Next.js marketing site
- `packages/shared-types`: Shared DTO contracts
- `infra/terraform`: Terraform placeholders
- `.github/workflows/ci.yml`: CI pipeline

Workspace and build orchestration:
- `pnpm-workspace.yaml`
- `turbo.json`

---

## Shared Types (`packages/shared-types`)
Single source of DTO contracts used by backend and mobile, including:
- Auth DTOs (`RegisterRequestDto`, `LoginRequestDto`, `GoogleLoginRequestDto`, `AuthTokensDto`)
- Group DTOs (`CreateGroupRequestDto`, `InviteMemberRequestDto`, `GroupDto`)
- Expense DTOs (`CreateExpenseRequestDto`, `CreateExpenseSplitDto`, `UpdateExpenseRequestDto`, `ExpenseDto`)
- Balance DTO (`BalanceDto`)
- Settlement DTOs (`CreateSettlementRequestDto`, `SettlementDto`)
- Receipts and simplify DTOs (`PresignedReceiptUrlResponseDto`, `SimplifySuggestionDto`)

---

## Backend (`apps/backend`)

### Framework and Core Setup
- Nest app with global config
- Global validation pipe (`whitelist`, `forbidNonWhitelisted`, `transform`)
- CORS enabled with env-based origins
- Global API prefix: `/api/v1`
- JWT auth guard and `CurrentUser` decorator

### Modules Implemented
- `auth`
- `users`
- `groups`
- `expenses`
- `balances`
- `settlements`
- `simplify`
- `receipts`
- `redis`
- `s3`
- `common` (Prisma service/module)

### Auth Features
Endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`

Behavior:
- Email/password auth with bcrypt hashing
- JWT access token issuance
- Refresh token rotation storage in `refresh_tokens` table (hashed)
- Google login endpoint (payload-driven MVP flow)

### Groups Features
Endpoints:
- `POST /api/v1/groups`
- `GET /api/v1/groups`
- `GET /api/v1/groups/:id`
- `POST /api/v1/groups/:id/invite`

Behavior:
- Group creation with owner membership in a transaction
- Group listing by membership
- Group detail with member list caching
- Invite by email (upsert membership)

### Expenses Features
Endpoints:
- `POST /api/v1/groups/:id/expenses`
- `GET /api/v1/groups/:id/expenses`
- `GET /api/v1/expenses/:id`
- `PATCH /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`

Behavior:
- Expense creation in DB transaction:
  1. Insert expense
  2. Insert splits
  3. Update balances
- Balance logic implemented per rule:
  - If A paid and B owes, store:
    - `B -> A` negative amount
    - `A -> B` positive amount
- Cache invalidation after mutating operations

### Balances Features
Endpoint:
- `GET /api/v1/groups/:id/balances`

Behavior:
- Reads and returns group balances
- Redis cache for group balances

### Settlements Features
Endpoint:
- `POST /api/v1/groups/:id/settlements`

Behavior:
- Settlement creation in transaction
- Reverse-adjust balance records between payer and receiver
- Cache invalidation after creation

### Simplify Features
Endpoint:
- `GET /api/v1/groups/:id/simplify`

Behavior:
- Greedy debt simplification algorithm:
  - Compute net balance per user
  - Split into debtors and creditors
  - Generate settlement suggestions

### Receipts Features
Endpoint:
- `POST /api/v1/expenses/:id/receipt-url`

Behavior:
- Generates S3 presigned upload URL
- File path pattern:
  - `receipts/{groupId}/{expenseId}/{uuid}.{ext}`
- Stores/upserts `Receipt` record with `fileKey`

### Redis Features
Cached keys:
- `group:{groupId}:balances`
- `group:{groupId}:members`

Invalidation:
- On expense create/delete/update effects
- On settlement create
- On invite/member-affecting operations

### Prisma Schema
`apps/backend/prisma/schema.prisma` models:
- `User`
- `Group`
- `GroupMember`
- `Expense`
- `Split`
- `Balance`
- `Settlement`
- `Receipt`
- `RefreshToken`

Money fields use `BigInt`:
- `Expense.totalAmountCents`
- `Split.owedAmountCents`
- `Split.paidAmountCents`
- `Balance.amountCents`
- `Settlement.amountCents`

### Backend Tests
Unit/integration-style tests include:
- Split/balance delta calculation
- Simplify algorithm
- Expense transaction flow
- Settlement transaction flow
- Module service existence smoke tests

---

## Mobile (`apps/mobile`)

### Stack and UX Libraries
- Expo SDK 54
- React Navigation (native stack + bottom tabs)
- Zustand stores
- React Hook Form
- React Native Paper
- Reanimated + Gesture Handler
- Expo Haptics
- Expo Linear Gradient
- Lottie (ready)
- Expo Secure Store

### Theme System (`app/theme`)
- `colors.ts`
- `spacing.ts`
- `typography.ts`
- `theme.ts`

Configured design tokens:
- Primary: `#4F46E5`
- Background: `#F8FAFC`
- Font intent: Inter

### Reusable UI Components (`app/components/ui`)
- `Button.tsx`
- `Card.tsx`
- `Avatar.tsx`
- `ListItem.tsx`
- `MoneyText.tsx`
- `EmptyState.tsx`
- `LoadingSpinner.tsx`
- `GlobalToast.tsx`

### Navigation
- Auth stack:
  - `LoginScreen`
  - `RegisterScreen`
- Main bottom tabs:
  - `Home`
  - `Groups`
  - `Activity`
  - `Profile`
- Additional screens:
  - `GroupDetailScreen`
  - `AddExpenseScreen`
  - `ExpenseDetailScreen`
  - `SettleUpScreen`
  - `SettingsScreen`

### API Layer (`app/services`)
- `api.ts` axios instance with auth token interceptor
- `auth.service.ts`
- `group.service.ts`
- `expense.service.ts`
- `settlement.service.ts`

### State Management (`app/store`)
- `authStore`
- `groupStore`
- `expenseStore`
- `toastStore`

### UX Improvements Included
- Pull-to-refresh
- Loading indicators
- Snackbar error/info toast handling
- Haptic feedback on key actions
- Subtle reanimated transitions on home

### Mobile Tests
- Basic render test: `LoginScreen.spec.tsx`

---

## Web (`apps/web`)

### Stack
- Next.js (App Router)
- Tailwind CSS
- Framer Motion

### Pages Implemented
- `/` (hero, product section, features grid, how it works, testimonials, CTA/footer)
- `/features`
- `/pricing`
- `/about`
- `/login`

Files:
- `app/layout.tsx`
- `app/globals.css`
- page files under `app/*/page.tsx`
- `tailwind.config.ts`
- `postcss.config.js`

---

## CI Pipeline
Workflow: `.github/workflows/ci.yml`

Steps:
1. Checkout
2. Setup pnpm
3. Setup Node
4. Install dependencies
5. Run lint
6. Run tests
7. Build backend
8. Build mobile
9. Build web

---

## Environment Variables
Defined in `.env.example`:
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

---

## Scripts

### Root (`package.json`)
- `pnpm dev` -> `turbo run dev --parallel`
- `pnpm build` -> `turbo run build`
- `pnpm lint` -> `turbo run lint`
- `pnpm test` -> `turbo run test`
- `pnpm format` -> `turbo run format`

### Backend (`apps/backend/package.json`)
- `pnpm --filter backend dev`
- `pnpm --filter backend build`
- `pnpm --filter backend lint`
- `pnpm --filter backend test`
- `pnpm --filter backend prisma:generate`
- `pnpm --filter backend prisma:migrate`

### Mobile (`apps/mobile/package.json`)
- `pnpm --filter mobile dev`
- `pnpm --filter mobile build`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`

### Web (`apps/web/package.json`)
- `pnpm --filter web dev`
- `pnpm --filter web build`
- `pnpm --filter web lint`
- `pnpm --filter web test`

---

## Local Run Checklist
1. Install deps:
   - `pnpm install`
2. Set env vars (`.env`)
3. Generate Prisma client:
   - `pnpm --filter backend prisma:generate`
4. Run DB migration:
   - `pnpm --filter backend prisma:migrate --name mvp_schema`
5. Start all apps:
   - `pnpm dev`

Quality commands:
- `pnpm lint`
- `pnpm build`
- `pnpm test`

---

## Current Status Notes
- MVP architecture and core features are implemented.
- Prisma migration command is ready; it requires `SUPABASE_DATABASE_URL` to be set.
- Backend tests pass, mobile test passes, workspace lint/build/test pass in current setup.
