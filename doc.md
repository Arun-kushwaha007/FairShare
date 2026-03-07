# FairShare - Current Documentation (March 2026)

## 1. Project Snapshot
FairShare is a pnpm + Turborepo monorepo for shared expense management.

- Mobile: Expo React Native (TypeScript strict)
- Backend: NestJS (TypeScript strict)
- Web: Next.js
- Database: PostgreSQL (Supabase) via Prisma
- Cache: Redis
- Storage: AWS S3

Current baseline:
- Auth + Supabase flow is working.
- Group/member flows are implemented.
- Real split creation UI is implemented.
- Backend and mobile have expanded logging + tests.

## 2. Monorepo Layout
- `apps/backend`
- `apps/mobile`
- `apps/web`
- `packages/shared-types`
- `infra/terraform`
- `scripts`
- `.github/workflows`

Key root files:
- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json`
- `Makefile`
- `.prettierrc`
- `doc.md`

## 3. Shared Types
`packages/shared-types` is the contract source for backend + mobile.

Notable DTOs:
- Auth tokens + auth request DTOs
- Groups, expenses, balances, settlements
- Activity DTOs
- Receipt URL DTO
- Push token DTO
- Group member summary DTO (`GroupMemberSummaryDto`)

## 4. Backend Status

### 4.1 Core Runtime
- API prefix: `/api/v1`
- ValidationPipe: enabled globally
- Helmet + compression + cookie parser
- CORS from env config
- Throttler enabled (`100/min/IP`)
- Request logging middleware:
  - logs method, path, status, duration

### 4.2 Auth
Endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `POST /api/v1/auth/refresh`

Behavior:
- JWT access + refresh
- Refresh rotation persisted in DB
- duplicate email handling in register

### 4.3 Group/Member Management
Endpoints:
- `POST /api/v1/groups`
- `GET /api/v1/groups`
- `GET /api/v1/groups/:id`
- `GET /api/v1/groups/:id/members`
- `POST /api/v1/groups/:id/invite`

Membership validation:
- group-read and group-member routes validate actor membership

### 4.4 Expenses / Balances / Settlements / Simplify / Receipts
Expenses:
- `POST /api/v1/groups/:id/expenses`
- `GET /api/v1/groups/:id/expenses`d
- `GET /api/v1/expenses/:id`
- `PATCH /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`

Balances:
- `GET /api/v1/groups/:id/balances`

Settlements:
- `POST /api/v1/groups/:id/settlements`

Simplify:
- `GET /api/v1/groups/:id/simplify`

Receipts:
- `POST /api/v1/expenses/:id/receipt-url`

### 4.5 Activity + Notifications
Activity:
- `GET /api/v1/groups/:id/activity`

Notifications:
- Notification event types:
  - `expense_created`
  - `expense_deleted`
  - `settlement_created`
  - `group_invite`
- Redis pub/sub channel used for internal notification queue/broadcast
- Push provider is still a stub logger (infra-ready, not external provider yet)

### 4.6 Database and Prisma
- Prisma datasource points to `SUPABASE_DATABASE_URL`
- Schema synced with Supabase
- Key models in use:
  - users, groups, group_members, expenses, splits, balances, settlements,
    receipts, refresh_tokens, activities, push_tokens

## 5. Mobile Status

### 5.1 Navigation
Auth stack:
- `LoginScreen`
- `RegisterScreen`

Root stack (post-auth):
- `Dashboard` (HomeScreen)
- `Tabs`
- `GroupDetail`
- `GroupMembers`
- `AddExpense`
- `ExpenseDetail`
- `SettleUp`
- `Settings`

Tabs:
- `Groups`
- `Activity`
- `Profile`

### 5.2 Dashboard
`HomeScreen` now acts as dashboard:
- recent activity preview
- quick add expense action
- quick settle suggestion action
- floating add-expense button

### 5.3 Group Flows
`GroupDetailScreen`:
- member avatars row at top
- member tap -> member balance summary toast
- sections:
  - Today
  - This week
  - Older
- expense row shows payer/avatar/participants/date/amount
- swipe left -> delete
- confirm delete modal

`GroupMembersScreen`:
- list members
- invite by email
- invite action button

### 5.4 Expense Creation (Real Split UI)
`AddExpenseScreen` now supports:
- load real group members
- payer selection
- participant selection
- split types:
  - equal
  - exact amount
  - percentage
- inline split validation mismatch error

`SplitSelector` component:
- path: `app/components/ui/SplitSelector.tsx`

Split math utilities:
- path: `app/utils/split.ts`

### 5.5 API Layer and Error Handling
`app/services/api.ts`:
- auth header interceptor
- base URL resolution for real-device dev
- structured API errors (`code`, `message`, `context`)
- critical server errors reported to Sentry

### 5.6 Notifications on Mobile
- push token registration on authenticated state
- notification tap routing:
  - expense event -> `ExpenseDetail`
  - settlement/invite event -> `GroupDetail`

### 5.7 UI/Polish
- MaterialCommunityIcons standardized in navigation/empty-state usage
- custom button variants + press-scale animation in `ui/Button`
- empty-state visual improvements
- illustration placeholders added:
  - `app/assets/illustrations/no-groups.txt`
  - `app/assets/illustrations/no-expenses.txt`
  - `app/assets/illustrations/no-activity.txt`

## 6. Logging Guide

### Mobile logs
- `[auth-ui]`: button click, validation, submit start/success/failure
- `[auth]`: auth service payload tracing
- `[api]`: base URL, request, response, structured error

### Backend logs
- `AuthController`: route entry
- `AuthService`: auth attempt/success/failure
- `PrismaService`: DB host + connection state
- `RequestLoggerMiddleware`: method/path/status/duration

## 7. Testing Status

Backend tests expanded for:
- group invite edge cases
- member listing
- split sum validation
- notification assertions in expense flow

Mobile tests added for:
- `GroupListScreen` render path
- `AddExpenseScreen` validation path
- `SplitSelector` interaction
- split utility math

## 8. CI Status (`.github/workflows/ci.yml`)
Pipeline now has separate jobs:
- `typecheck`
- `lint`
- `test`
- `build` (depends on above)

Includes:
- pnpm cache
- turbo cache
- Prisma generate step
- coverage artifact upload

## 9. Env Variables

Root `.env.example` includes:
- `SUPABASE_DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REDIS_URL`
- `CORS_ORIGINS`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`
- `SENTRY_DSN`
- `EXPO_PUBLIC_SENTRY_DSN`

Mobile `apps/mobile/.env.example`:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_S3_BASE_URL`

## 10. Scripts and Tooling

Root scripts:
- `pnpm install`
- `pnpm dev`
- `pnpm dev:backend`
- `pnpm dev:mobile`
- `pnpm dev:web`
- `pnpm build`
- `pnpm test`
- `pnpm format`
- `pnpm seed`

Makefile:
- `make dev`
- `make test`
- `make build`
- `make dev-backend`
- `make dev-mobile`
- `make dev-web`

## 11. Known Notes
- Expo Go shows `expo-notifications` limitation warnings (expected in Expo Go).
- AWS SDK v2 deprecation warning appears in backend logs; migration to v3 is pending.
- Push notification sending is queue + logging infrastructure ready, external push provider integration pending.
