# FairShare Project Status

Last updated: March 12, 2026

## Overview

FairShare is a monorepo expense-sharing application with:

- A NestJS backend in `apps/backend`
- An Expo React Native mobile app in `apps/mobile`
- A web app workspace in `apps/web`
- Shared TypeScript contracts in `@fairshare/shared-types`

The project is beyond bootstrap stage. Core expense-sharing flows, settlements, notifications, receipts, realtime updates, and payment intent creation are implemented. Recent work has shifted toward reliability, idempotency, delivery safety, and production hardening.

## Infrastructure And Deployment

- Monorepo managed with `pnpm` and Turbo
- PostgreSQL accessed through Prisma
- Redis used for cache invalidation and queue-related workflows
- Socket.IO used for realtime updates
- S3 integration present for receipt flows using AWS SDK v3 presigning
- Stripe integration present for payment intents and webhooks
- Sentry and OpenTelemetry hooks present in the backend

Backend runtime characteristics:

- Nest listens on `0.0.0.0`
- Global API prefix is `/api/v1`
- CORS is enabled from configured origins
- Throttling, compression, helmet, cookie parsing, CSRF protection, and request logging are enabled

## Backend Implementation

### Implemented modules

The backend currently wires these major modules:

- Auth
- Users
- Groups
- Expenses
- Balances
- Settlements
- Simplify
- Receipts
- Notifications
- Payments
- Jobs
- Activity
- Realtime
- Health
- Observability
- Redis
- S3
- Prisma

### Implemented backend capabilities

- User authentication and token-based login flows
- Group creation and membership management
- Expense creation, listing, update, deletion, and detail retrieval
- Balance tracking and debt simplification support
- Settlement creation between group members
- Receipt upload URL generation
- Activity logging for domain actions
- Push token registration and notification delivery workflows
- Stripe payment intent creation
- Payment webhook handling that records successful payments as settlements
- Realtime emission for group activity
- Health and metrics endpoints

### Recent backend fix

A NestJS startup failure caused by a module cycle was resolved.

Problem chain:

- `SettlementsModule -> NotificationsModule -> JobsModule -> PaymentsModule -> SettlementsModule`

Resolution:

- `SettlementsModule` now uses `forwardRef(() => NotificationsModule)` so Nest can resolve the cycle during module initialization

This restored a clean backend boot path.

### Recent backend reliability work

Additional backend hardening completed in the latest pass:

- Migrated S3 presigned upload generation from AWS SDK v2 to AWS SDK v3
- Added receipt upload URL coverage with service-level and HTTP-level tests
- Hardened payment webhook processing so settlement creation happens before payment status is marked `succeeded`
- Improved settlement idempotency handling for duplicate webhook delivery and unique-key races
- Enforced Stripe signature presence when a webhook secret is configured
- Added notification delivery retry backoff and automatic cleanup of invalid Expo push tokens

## Frontend And UX

### Mobile status

The Expo mobile app already includes:

- Login and registration
- Group list and group detail flows
- Group members view
- Add expense and expense detail flows
- Settlement flow
- Activity screen
- Profile and settings screens
- Shared UI components for cards, buttons, avatars, skeleton states, empty states, and toasts
- Zustand-based stores for auth, groups, expenses, and toast state
- Service clients for auth, groups, expenses, settlements, realtime, and users

Implemented mobile platform features:

- API client with request logging and latency tracking
- Bearer-token injection from secure storage
- Realtime connection after authentication
- Push token registration through `expo-notifications`
- Offline POST queueing for selected write actions

### Recent mobile fixes

Recent development fixes addressed local runtime issues:

- Removed the stale `apps/mobile/.env` override for `EXPO_PUBLIC_API_URL`
- Stopped forcing the dead API host `http://10.111.154.142:3001/api/v1`
- Restored local API host auto-detection from the Expo runtime host
- Removed the `api.ts` <-> `offlineQueue.ts` require cycle
- Refactored the offline queue so it receives a request executor from `api.ts` instead of importing the API client directly

This makes local mobile networking more reliable as long as the device and backend machine are on the same reachable network.

### Web status

The web workspace exists in the monorepo, but backend and mobile appear to be the most actively implemented parts of the product at this stage. Web should be treated as secondary until a dedicated milestone or readiness target is documented.

## Testing And CI

Repository-level scripts include:

- `pnpm lint`
- `pnpm test`
- `pnpm e2e`

Recent validation used during current fixes:

- `pnpm --filter backend lint`
- `pnpm --filter backend build`
- `pnpm --filter backend test -- receipts`
- `pnpm --filter backend test -- payments settlements`
- `pnpm --filter backend test -- notifications`
- `pnpm --filter mobile exec tsc --noEmit`

There are tests in both backend and mobile codebases. The latest backend pass added direct coverage for receipt URL generation, payment webhook idempotency, settlement idempotency behavior, and notification retry handling.

## Logging And Observability

Backend observability already includes:

- Sentry initialization
- OpenTelemetry startup and shutdown hooks
- Request logging middleware
- Domain logging around notifications and payments
- Prometheus-style metrics infrastructure through `prom-client`

Mobile development diagnostics currently include:

- API base URL logging in development
- Request, response, and error logging in the API client
- API latency tracking

## Environment And Secrets

Backend environment configuration currently covers:

- Port
- CORS origins
- Redis connection
- PostgreSQL and Prisma access
- Stripe secret and webhook configuration
- S3 configuration
- Sentry DSN

Mobile environment configuration currently covers:

- Optional `EXPO_PUBLIC_API_URL` override
- Optional `EXPO_PUBLIC_SENTRY_DSN`

Important local mobile networking behavior:

- If `EXPO_PUBLIC_API_URL` is set, it overrides host auto-detection
- If it is not set, the app derives the backend host from the Expo runtime host during local development
- The phone or emulator and the backend machine must still be on the same reachable network

## Current Status

### Working now

- Backend boots successfully
- Core API surface for auth, groups, expenses, balances, settlements, receipts, notifications, payments, and activity is implemented
- Prisma, Redis, realtime, and payment flows are integrated in the backend
- Receipt upload URLs are generated through AWS SDK v3 presigning
- Payment webhook settlement handling is idempotent at the settlement layer and safer under retry
- Invalid Expo push tokens are removed automatically after permanent delivery failures
- Mobile app can authenticate, navigate the core flows, register push tokens, connect to realtime, and use the offline queue

### Partially complete

- Push notifications are implemented, but full remote notification testing should use a development build instead of Expo Go
- Payments are implemented at the intent and webhook level, with improved idempotency, but still need broader production validation
- Web progress is less clearly advanced than backend and mobile

## Known Gaps

- Expo package versions are slightly out of sync with the installed SDK and still produce compatibility warnings
- `expo-notifications` remote push support is limited in Expo Go
- Local mobile networking remains environment-sensitive when LAN addressing changes
- Receipt OCR and structured receipt parsing are not implemented yet
- Smart split suggestion APIs and UI are not implemented yet
- Mobile notification center and expanded offline retry UI are not implemented yet
- Broader observability counters and tracing for expense, settlement, and webhook flows still need expansion

## Next Steps

1. Align Expo package versions with the installed SDK.
2. Validate login, expense, settlement, payment, and notification flows end to end on a real device and a development build.
3. Add receipt OCR processing and structured receipt item storage.
4. Add smart split suggestion APIs and mobile UI.
5. Expand observability counters and tracing for expense creation, settlement creation, and webhook processing.
6. Clarify the target scope and milestone for the web workspace.
