# FairShare - Current Project Documentation

## 1) Project Snapshot
FairShare is a pnpm + Turborepo monorepo.

- Mobile: Expo React Native (TypeScript strict)
- Backend: NestJS (TypeScript strict)
- Web: Next.js
- DB: PostgreSQL (Supabase) via Prisma
- Cache: Redis
- Storage: AWS S3 (presigned upload URLs)

Current state:
- Auth flow is connected end-to-end with Supabase.
- Register/Login works.
- Group listing works after auth.
- Core backend modules and routes are running.

## 2) Monorepo Structure
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
- `.env.example`
- `doc.md`

## 3) Shared Contracts (`packages/shared-types`)
Single source of DTO truth for backend + mobile.

Includes:
- Auth DTOs (`RegisterRequestDto`, `LoginRequestDto`, `AuthTokensDto`)
- Group DTOs
- Expense + split DTOs
- Balance + settlement DTOs
- Activity DTOs
- Receipt upload DTOs
- Push token DTOs

Rule followed:
- DTOs are not duplicated in app code.

## 4) Backend Status

### Runtime and Security
- Global prefix: `/api/v1`
- Global validation pipe: enabled (`whitelist`, `forbidNonWhitelisted`, `transform`)
- CORS: env-driven
- Helmet: enabled
- Compression + cookie-parser: enabled
- Throttling: enabled (`100 req / minute / IP`)

### Auth
Implemented and working:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `POST /api/v1/auth/refresh`

Behavior:
- Access token + refresh token returned
- Refresh token hashed in DB
- Refresh cookie set (httpOnly, path-scoped)
- Duplicate email returns conflict handling

### API Modules Implemented
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

### Route Coverage
Auth:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/google`
- `POST /api/v1/auth/refresh`

Users:
- `GET /api/v1/users/me`
- `POST /api/v1/users/push-token`

Groups:
- `POST /api/v1/groups`
- `GET /api/v1/groups`
- `GET /api/v1/groups/:id`
- `POST /api/v1/groups/:id/invite`

Expenses:
- `POST /api/v1/groups/:id/expenses`
- `GET /api/v1/groups/:id/expenses`
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

Activity:
- `GET /api/v1/groups/:id/activity`

### Prisma/Supabase
- Prisma datasource uses `SUPABASE_DATABASE_URL`
- DB connection logging added
- Schema pushed to Supabase and now in sync

Important tables in use:
- `users`, `groups`, `group_members`, `expenses`, `splits`, `balances`, `settlements`, `receipts`, `refresh_tokens`, `activities`, `push_tokens`

## 5) Mobile App Status

### Navigation
Auth stack:
- `LoginScreen`
- `RegisterScreen`

Main tabs:
- `Home`
- `Groups`
- `Activity`
- `Profile`

Extra stack screens:
- `GroupDetail`
- `AddExpense`
- `ExpenseDetail`
- `SettleUp`
- `Settings`

### Auth Screens (Current)
Implemented improvements:
- Form validation rules (email format, password min length, name min length)
- Submit loading state
- Duplicate tap protection via disabled submit while submitting
- Toast errors visible in auth screens (GlobalToast mounted at app root)
- Detailed auth debug logs on click/submit/success/failure

### API Layer (Mobile)
`app/services/api.ts`:
- Axios instance with auth header interceptor
- Auto base URL resolution for local dev
- Rejects bad Expo tunnel host fallback for backend API
- Dev logs for request/response/error

`EXPO_PUBLIC_API_URL` recommended in `apps/mobile/.env`:
- Example: `http://10.111.154.142:3001/api/v1`

### Current Known Mobile Warning
- Expo notifications warning in Expo Go is expected and non-blocking.
- For full push behavior, use a development build later.

## 6) Screen Flows and Action Buttons

### LoginScreen
Buttons:
- `Login` -> validates form -> calls `/auth/login` -> stores tokens -> enters app
- `Create Account` -> navigates to Register screen

Status:
- Working

### RegisterScreen
Buttons:
- `Register` -> validates form -> calls `/auth/register` -> stores tokens -> enters app
- `Back to Login` -> returns to Login

Status:
- Working

### HomeScreen
Buttons:
- `Open Groups` -> navigates to Groups tab

Status:
- Working

### GroupListScreen
Actions:
- Pull-to-refresh -> reload groups
- Group list item press -> open GroupDetail
- FAB `plus` -> navigate to AddExpense

Status:
- Group fetch works
- Create expense navigation works

### GroupDetailScreen
Buttons:
- `Add Expense` -> AddExpense screen
- `Settle Up` -> SettleUp screen
- Expense item -> ExpenseDetail
- FAB `plus-circle` -> AddExpense

Status:
- Screen and navigation working
- Uses skeleton loading + toasts

### AddExpenseScreen
Button:
- `Create Expense` -> calls create expense API

Status:
- Functional, but currently uses placeholder payer/split values (`me`) and should be wired to real user/member IDs for production behavior.

### ExpenseDetailScreen
Buttons/actions:
- `Generate Receipt Upload URL` -> calls receipt endpoint
- Receipt preview tap -> opens image modal

Status:
- Working for presigned URL creation and preview flow
- S3 read URL requires valid `EXPO_PUBLIC_S3_BASE_URL`

### SettleUpScreen
Actions:
- Loads simplify suggestions
- Suggestion button press -> creates settlement

Status:
- Working flow

### ActivityScreen
Actions:
- Pull-to-refresh
- Infinite list paging (client-side window over fetched events)

Status:
- Working
- If opened without `groupId`, shows empty state

### ProfileScreen
Buttons:
- `Settings` -> settings screen
- `Logout` -> clears session

Status:
- Working

### SettingsScreen
Status:
- Basic placeholder content present

## 7) Logging and Debug Purpose

### Mobile Log Prefixes
- `[auth-ui]`:
  - Purpose: user interaction diagnostics on auth screens
  - Examples: submit click, validation fail, request start, success, failure

- `[auth]`:
  - Purpose: payload-level auth service request tracing on mobile

- `[api]`:
  - Purpose: transport-level debugging
  - Logs base URL, request method+path, response status, error body

### Backend Log Prefixes
- `AuthController`:
  - Purpose: incoming auth route entry traces

- `AuthService`:
  - Purpose: auth business flow outcomes (attempt/success/failure)

- `PrismaService`:
  - Purpose: DB connectivity diagnostics (target host + connect state)

## 8) Feature Status Matrix
- Register API: `working`
- Login API: `working`
- Supabase connection: `working`
- Refresh token flow: `implemented`
- Groups list fetch: `working`
- Activity endpoint + mobile list: `working`
- Simplify endpoint + settle action: `working`
- Receipt upload URL generation: `working`
- Push token registration endpoint: `implemented`
- Real push delivery provider: `stub/logging only`
- Settings page: `basic placeholder`
- AddExpense real member-aware split UX: `partial`

## 9) Environment Variables
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

Mobile `apps/mobile/.env.example` includes:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SENTRY_DSN`
- `EXPO_PUBLIC_S3_BASE_URL`

## 10) Scripts and Commands

Root:
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm seed`

Backend:
- `pnpm --filter backend dev`
- `pnpm --filter backend build`
- `pnpm --filter backend prisma:generate`
- `pnpm --filter backend prisma:migrate`
- `pnpm --filter backend seed`

Mobile:
- `pnpm --filter mobile dev`
- `pnpm --filter mobile exec expo start --clear`
- `pnpm --filter mobile build`

Web:
- `pnpm --filter web dev`
- `pnpm --filter web build`

## 11) Notes
- `AWS SDK v2` deprecation warning appears in backend logs; not blocking runtime now.
- Expo Go notification warnings are expected; not blocking auth or group flows.
