# FairShare Repo Status, Risks, and Launch Readiness Review

Last updated: April 6, 2026

## 1. Executive Summary

FairShare is no longer just a prototype. The monorepo has a working backend, a usable web app, and a usable mobile app with real shared-expense flows:

- auth
- groups
- invites
- expense creation
- settlements
- recurring expenses
- activity feed
- receipts
- realtime updates
- basic offline mutation support on mobile

The repo has also advanced in the last few days:

- web home and shell responsiveness/accessibility improved
- modal focus handling added on web
- aggregated dashboard endpoint added on backend
- web dashboard moved off the worst N+1 pattern
- balances CSV export added
- mobile offline mutation queue hardened with dedupe and broader mutation support

This is solid progress, but the product is still not launch-ready.

The main reason is not “missing everything.” The main reason is that the remaining issues are concentrated in launch-critical areas:

- unfinished parity across web and mobile
- incomplete guest/read-only and sharing flows
- weak backend hardening around some mutation paths and uploads
- sparse frontend coverage on web
- some dashboard/home UX friction still present on both platforms
- several production-grade edge cases still not fully closed

---

## 2. Current Repo Status

### Backend

Backend is the strongest part of the repo.

What is in place:

- NestJS API with modular structure
- Prisma persistence
- JWT auth
- groups, expenses, balances, settlements, simplify, receipts, notifications, activity, payments modules
- recurring expense materialization
- receipt presign flow
- realtime events
- rate limiting through Nest throttler
- tests across multiple backend services

Recent repo-accurate additions:

- `GET /groups/dashboard` aggregation endpoint
- balances CSV export endpoint

Current assessment:

- foundation is good
- business logic is mostly centralized correctly
- still needs some hardening for uploads, idempotency semantics, and invite abuse protection

### Web

Web has improved meaningfully, but it still trails mobile in some practical product polish.

What is working:

- marketing site and dashboard shell
- group detail pages
- expense filters by date, payer, category
- expense detail page with edit flow
- expense delete flow
- expense CSV export
- balances CSV export
- recurring expense management
- settlement page

Recent repo-accurate additions:

- responsive hero/layout cleanup
- stronger glass-card contrast
- improved mobile nav behavior
- focus trap for major modals
- aggregated dashboard usage instead of per-group simplify/recurring fetch fanout

Current assessment:

- usable
- more structured than before
- still has rough interaction and dashboard CTA gaps
- still needs stronger parity and stronger component testing

### Mobile

Mobile remains the better product surface overall.

What is working:

- core auth and navigation
- groups and activity
- add expense flow
- expense detail screen with edit and receipt upload
- settlement flow
- recurring expense support
- offline queue infrastructure

Recent repo-accurate additions:

- offline mutation queue dedupe
- queue support expanded beyond only raw POST expense creation behavior
- idempotency key generation broadened for mutation use

Current assessment:

- strongest user-facing flow set
- still has dashboard/home inefficiencies and some unresolved UX problems
- still needs gesture conflict handling and overflow handling in high-density cases

---

## 3. What Has Been Done So Far

This section reflects the current repo, including recent commits.

### Completed Core Platform Work

- registration and login flows exist
- groups can be created and listed
- members can be invited
- expenses can be created with equal, exact, and percentage splits
- settlements can be recorded
- balances and simplify suggestions exist
- recurring expenses exist and materialize into real expenses
- activity feed exists
- receipts can be attached
- backend payments groundwork exists

### Completed Recent Launch-Readiness Work

- fixed web hero responsiveness and shell layout issues
- improved web modal keyboard handling with focus trap support
- improved web navbar mobile behavior
- improved text contrast on web glass surfaces
- added backend aggregated dashboard endpoint
- switched web dashboard to consume aggregated dashboard data
- added balances CSV export flow
- hardened mobile offline mutation queue with dedupe behavior and broader mutation support

### Existing Features That Were Previously Missing But Are Actually Present Now

- web expense deletion exists
- web expense editing exists on expense detail page
- web group filtering exists in expense history
- expense CSV export exists
- balances CSV export now exists

---

## 4. What Is Still Left

These are the material gaps that still block a clean launch.

### Product Gaps

- [x] guest read-only mode is implemented
- [x] shareable group link flow is implemented
- [x] explicit no-mutation guest guard flow exists
- [x] strict receipt file validation policy on backend and frontend
- [x] web inline expense editing flow in the group table
- [ ] no web “view all attention items” flow matching the mobile/product requirement
- [ ] no balances export entry from mobile

### Mobile UX / Stability Gaps

- swipe delete vs back navigation conflict still needs real handling
- attention queue still does not enforce the requested “max 3 + view all” behavior
- high-participant split UI overflow still needs dedicated handling for 10+ participants
- offline queue is better now, but not fully conflict-safe for every mutation family

### Backend Hardening Gaps

- [x] settlement duplication protection hardened with SHA-256 details-hash idempotency
- [x] S3 upload flow hardened with server-side size and MIME validation
- [ ] invite rate limiting exists, but it is still basic throttling rather than more targeted anti-abuse protection

### Testing Gaps

- web component and interaction coverage is still thin
- critical flows requested in the launch plan are not all covered
- dashboard aggregation endpoint does not yet have dedicated regression coverage
- mobile offline queue behavior changes need direct tests

---

## 5. Critical Issues

These are the highest-priority issues still visible from the current repo.

### 5.1 Dashboard Action Cleanup (Highest Priority)

### 5.4 Mobile Home Dashboard Still Has N+1-Like Client Fetch Fanout

`HomeScreen.tsx` still maps across groups and fetches:

- simplify suggestions per group
- recurring expenses per group

This is the same class of problem that was fixed for the web dashboard.

Impact:

- slower home load for users in many groups
- more battery/network usage
- more failure points

### 5.5 Some High-Visibility Dashboard Actions Are Still Dead or Weak

On web dashboard:

- the “Create New Crew” icon button is decorative only
- the “Review attention queue” button is decorative only

These are visible CTA affordances without complete behavior.

That is a launch problem because it creates false affordance and breaks trust.

---

## 6. Known Bugs and Behavioral Problems

These are current repo-level bugs or likely bugs based on implementation.

### Web

- expense deletion still uses `window.confirm`, which is functional but low-quality and inconsistent with the rest of the UI
- recurring expense deletion also uses `window.confirm`
- navbar still contains “Coming Soon!” while other home CTAs point to registration, creating messaging inconsistency
- some dashboard buttons look actionable but have no handler
- payer display on expense detail still shows raw `payerId` rather than resolved member name

### Mobile

- home screen “Split it” and “Settle Up” quick actions navigate using `groups[0]?.id ?? ''`
  - if the user has no groups, these routes can be triggered with an empty `groupId`
- home screen toast copy includes “Failed to sync your vibes”
  - functional, but not launch-grade product copy
- attention list can still grow beyond the desired compact form
- editing offline-created or recently queued data is safer than before, but conflict semantics are still incomplete outside the newly handled paths

### Backend

- settlements still depend on client idempotency behavior for strongest safety
- balances export currently emits only debtor-side negative balances as rows
  - this is likely correct enough for v1, but should be documented as canonical output format

---

## 7. Edge Cases Still Needing Attention

### Money and Splits

- rounding correction still concentrates residual cents into one participant in some flows
- exact and percentage split edits can still produce UX confusion if totals do not feel visibly balanced to the user

### Offline and Replay

- create + edit + delete sequences while offline remain sensitive
- queue dedupe is improved, but not every domain action is normalized into a conflict-safe replay model

### Empty-State Navigation

- dashboard/home quick actions need safer behavior when there are zero groups
- some action buttons should redirect to create group instead of pushing invalid or empty params

### Recurring Expenses

- materialization is in place, but high-volume backlog catch-up scenarios still deserve careful regression testing
- recurring and standard expense state can still diverge in user understanding if editing rules are not explained clearly

### Sharing / Access Control

- guest viewing does not exist yet
- therefore read-only edge cases and privilege boundaries for shared links remain completely unresolved

---

## 8. Testing Status

The old doc understated current testing. The repo already has meaningful test coverage in several places.

### Existing Tests in Repo

Backend:

- `groups.service.spec.ts`
- `balances.service.spec.ts`
- `expenses.service.spec.ts`
- `expenses.integration.spec.ts`
- `expense-calculator.spec.ts`
- `settlements.service.spec.ts`
- `settlements.integration.spec.ts`
- `receipts.service.spec.ts`
- `receipts.integration.spec.ts`
- `simplify.service.spec.ts`
- `activity.service.spec.ts`
- `payments.service.spec.ts`
- `notifications.service.spec.ts`
- `users.service.spec.ts`

Mobile:

- `AddExpenseScreen.spec.tsx`
- `GroupListScreen.spec.tsx`
- `LoginScreen.spec.tsx`
- `SplitSelector.spec.tsx`
- `split.test.ts`

E2E:

- `tests/e2e/fairshare.spec.ts`

### Testing Gaps That Still Matter

- web interaction/component tests are still far too sparse
- no focused test for the new web modal focus trap behavior
- no dedicated tests yet for `GET /groups/dashboard`
- no explicit regression tests for balances CSV export
- no direct test suite yet for the hardened mobile offline queue
- no meaningful UI regression coverage for dashboard/home screens

### Testing Priorities Next

1. backend tests for dashboard aggregation endpoint
2. backend tests for settlement duplication/idempotency race behavior
3. web tests for expense create/edit/delete flows
4. mobile tests for offline queue dedupe and queued update behavior
5. web tests for filtering and CSV action affordances

---

## 9. Security Status

### What Is Good

- auth exists
- JWT guard coverage is present across protected modules
- throttler is configured globally
- invite and reminder endpoints already have route-level throttle decorators
- expense and settlement creation support idempotency keys

### What Is Still Weak

- receipt upload validation is not strict enough yet
- invite abuse protection is still basic
- no guest-link permission model yet because guest mode does not exist
- some mutation families still rely too heavily on client correctness

### Security Priorities

1. strict receipt file validation
2. stronger settlement duplication protection
3. targeted invite abuse controls
4. guest-share access model design before release

---

## 10. UI/UX Bugs and Gaps

This section is specifically about dashboard and home page UX on both web and mobile.

### Web Home Page

What improved:

- hero scaling is better
- navbar is more stable
- contrast is better

Still weak:

- top-level home page still layers multiple blurred orbs and effects; it is improved but still visually heavy
- “Coming Soon!” in navbar conflicts with stronger conversion CTAs elsewhere
- home page still carries some visual noise from decorative motion that does not add product clarity
- static marketing sections still need a final content/CTA consistency pass

### Web Dashboard

What improved:

- aggregated endpoint removed the worst query fanout
- shell and glass surfaces are more readable

Still weak:

- dead CTA buttons remain
- some widgets feel ornamental instead of operational
- delete UX uses browser confirm instead of product-native confirmation
- expense editing exists only on detail page, not where users most often scan the ledger
- dashboard still mixes strong product data with decorative stylistic language in a few places

### Mobile Home / Dashboard

What is good:

- good structure
- quick actions are clear
- activity feed is understandable
- attention cards are useful

Still weak:

- still fetches per-group simplify/recurring data on load
- attention queue can occupy too much space
- no compact “3 items + view all” cap yet
- quick actions are unsafe when user has no groups
- product copy is still too casual in a few error/loading paths

### Mobile Overall Dashboard UX Risks

- gesture conflict still unresolved
- high-density groups can create crowded visual stacking
- split configuration layouts still need stronger handling for large participant counts

---

## 11. Performance and Optimization

### What Has Been Optimized

- web dashboard aggregation path
- reduced some web layout/rendering instability
- mobile offline queue replay logic is more disciplined than before

### What Still Needs Optimization

- mobile home/dashboard aggregation path should mirror web backend aggregation
- web home visual effects can still be trimmed for lower-end devices
- recurring expense and simplify data access patterns should continue moving toward fewer round-trips
- queue replay semantics should become more state-aware, not just request-aware

---

## 12. What Needs To Be Compromised for V1

These are reasonable compromises to ship cleanly.

### Good Compromises

- receipts as attachment proof only, no OCR
- balances export and expense export as CSV only, no analytics suite
- expense editing as minimal metadata editing first
- guest mode as read-only only, no mixed permissions in v1

### Bad Compromises

- shipping dead CTA buttons
- shipping unvalidated upload paths
- shipping without stronger settlement duplication safety
- shipping without at least minimal web flow tests
- shipping with empty-group quick action bugs on mobile

---

## 13. Recommended Next Order of Work

If continuing from the current repo, the practical next sequence should be:

1. fix mobile home/dashboard UX bugs
2. add mobile aggregation path similar to web dashboard
3. harden settlement duplication guarantees
4. harden receipt validation and upload policy
5. implement guest read-only mode and share link
6. replace weak web confirm dialogs with product-native confirmation
7. add backend dashboard/idempotency tests
8. add web expense flow tests

---

## 14. Bottom Line

FairShare now has a credible base and several recent launch-readiness improvements already landed in the repo.

What is true today:

- the backend is strong
- mobile is the best user surface
- web is much better than it was a few days ago
- core flows exist
- recent commits addressed real launch friction

What is also true:

- the repo still has unresolved launch blockers
- the biggest remaining work is not broad invention
- it is targeted hardening, parity closure, dead-UX cleanup, and production-grade safeguards

The product should now be treated as:

- not a prototype anymore
- not ready for broad launch yet
- close enough that disciplined finishing work will matter far more than new feature expansion
