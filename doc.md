# FairShare Product Comparison And Practical Roadmap

Last updated: March 27, 2026

## Purpose
This document compares the implemented feature set across:

- `apps/mobile`
- `apps/web`
- shared backend capabilities in `apps/backend`

It focuses on four questions:

1. What exists today in mobile vs web
2. What is missing in each surface
3. What should be added next without overcomplicating the app
4. Which practical ideas are validated by the current expense-sharing market

## How This Was Reviewed
The comparison below is based on code currently in the repo, not on marketing copy alone.

Primary implementation references reviewed:

- `apps/mobile/app/navigation/AppNavigator.tsx`
- `apps/mobile/app/screens/*`
- `apps/mobile/app/services/*`
- `apps/mobile/app/utils/offlineQueue.ts`
- `apps/web/app/dashboard/**/*`
- `apps/web/src/components/groups/*`
- `apps/web/src/lib/actions.ts`
- `apps/backend/src/**/*`

## Executive Summary
FairShare already has a solid shared-expense foundation:

- auth
- groups
- invitations
- expense creation
- settlement suggestions
- activity feeds
- receipts
- realtime sync

But parity is not complete.

Current pattern:

- Mobile is stronger for day-to-day operational use: offline queueing, push notifications, delete flow, quicker group-level overview, UPI-oriented settlement path.
- Web is stronger for structured data entry and admin-style workflows: category capture, default split preference saving, better receipt preview/upload, cleaner group detail shell.
- Backend supports more than either client currently exposes, especially around payments, updates, receipts, and shared data primitives.

The next phase should not be "add everything competitors have." It should be:

1. close the obvious mobile/web parity gaps
2. improve the highest-friction daily actions
3. add only a few practical features that clearly reduce user effort

## Feature Matrix
Legend:

- `Yes` = implemented in that client
- `Partial` = backend exists or UI exists but flow is incomplete
- `No` = not implemented in that client

| Area | Mobile App | Web App | Notes |
|---|---|---|---|
| Register / login | Yes | Yes | Both wired to backend auth |
| Protected authenticated shell | Yes | Yes | Tabs/stack on mobile, middleware/dashboard on web |
| Profile view | Yes | Yes | Mobile has menu shell, web has account panel |
| Appearance theme switch | Yes | Yes | Web settings is mostly appearance only |
| Group list | Yes | Yes | Present on both |
| Create group | Yes | Yes | Present on both |
| Group detail | Yes | Yes | Both implemented, but not the same depth |
| Group members list | Yes | Yes | Both can fetch/display members |
| Invite member by email | Yes | Yes | Present on both |
| Group-level financial summary | Yes | Partial | Mobile shows total spend and personal balance; web detail page does not show personal owed/owes breakdown |
| Expense list in a group | Yes | Yes | Present on both |
| Expense detail page | Yes | Yes | Web is richer visually |
| Create expense | Yes | Yes | Both support equal/exact/percentage splitting |
| Expense category capture | No | Yes | Backend supports category, web exposes it, mobile does not |
| Save default split preference | No | Yes | Web can persist default split config; mobile cannot |
| Update expense | No UI | No UI | Backend supports update, but neither client exposes editing flow |
| Delete expense | Yes | No | Mobile has swipe-to-delete; web lacks delete action |
| Receipt attach/upload | Partial | Yes | Web uploads file to S3; mobile only generates presigned URL and preview path |
| Receipt preview | Partial | Yes | Web better supported; mobile preview depends on manual base URL usage |
| Activity feed | Yes | Yes | Both implemented |
| Activity filtering by group | Partial | Yes | Web activity screen supports group context better; mobile can load group activity if navigated with `groupId` |
| Realtime updates | Yes | Yes | Both use Socket.IO |
| Offline-safe write queue | Yes | No | Mobile queues create/invite/settlement POSTs |
| Push notifications | Yes | No | Mobile registers Expo push token; web has no browser notification flow |
| Settlement suggestions | Yes | Yes | Both use simplify endpoint |
| Settlement completion | Yes | Yes | Both record settlements |
| Payment rail UX | Partial | No | Mobile has UPI deep-link helper; backend also has Stripe intent support not exposed cleanly in either client |
| Payments / Stripe checkout UX | No | No | Backend exists, client product is missing |
| Search / filter expenses | No | No | Not surfaced |
| Export data | No | No | Not surfaced |
| Recurring expenses | No | No | Not surfaced |
| Read-only sharing | No | No | Not surfaced |
| Receipt OCR / smart extraction | No | No | Backend has only upload plumbing, no processing worker |

## Where Mobile Is Ahead
- Offline queueing is implemented and valuable for real-life usage during travel, patchy networks, or in-the-moment entry.
- Push notification support exists through Expo token registration.
- Group detail is more operational: total group spending, personal balance, grouped expense history, quick settle/add actions.
- Expense deletion exists.
- Settlement flow is more practical for India because it includes UPI deep-linking.

## Where Web Is Ahead
- Expense creation is more complete because it includes category selection.
- Web supports saving and resetting default split preferences per group.
- Receipt handling is materially better because the user can actually choose a file and upload it.
- The authenticated dashboard is more structured for overview and admin-like usage.
- Activity presentation and group context are cleaner for desktop review.

## Missing In Web
These are the strongest parity gaps in the web app:

### 1. No expense delete flow
Mobile already supports deletion. Web users can inspect expenses but cannot remove mistakes.

Why it matters:

- correcting wrong entries is a core ledger action
- desktop users often do cleanup/admin work

### 2. No true group financial summary parity
Web group detail shows totals and members, but not the mobile-style "your balance" summary and owed/owes clarity.

Why it matters:

- users mostly want one answer: "what do I owe?" or "who owes me?"
- that answer should be visible at group-entry level

### 3. No offline resilience
This is acceptable for v1 web, but it is still a gap compared with mobile.

Practical stance:

- full offline web is not urgent
- lightweight draft persistence for forms would be enough

### 4. No payment assist path
Web can record settlements, but has no payment guidance layer like mobile's UPI flow.

## Missing In Mobile
These are the strongest parity gaps in the mobile app:

### 1. No category selection when creating an expense
Backend already supports categories and web already captures them.

Why it matters:

- categories unlock charts, monthly summaries, and smarter receipt handling later
- this is low complexity and high future value

### 2. No saved default split preferences
Web lets users save a preferred split setup. Mobile does not.

Why it matters:

- recurring roommate/travel groups often repeat the same participant set
- this reduces repeated taps during the highest-frequency workflow

### 3. Receipt flow is incomplete
Mobile can request a presigned URL, but there is no polished file/image picking and upload flow comparable to web.

Why it matters:

- "generate upload URL" is a developer flow, not a product flow
- users expect to tap, choose image, upload, done

### 4. No expense edit flow
Backend supports updates, but mobile only supports delete, not edit.

Why it matters:

- many mistakes are small and should be fixed instead of deleted/recreated

## Missing In Both
These are the most meaningful shared product gaps:

### 1. No practical reminder system
You can record settlements, but there is no lightweight "remind this person" action tied to an outstanding balance.

### 2. No recurring expenses
Rent, Wi-Fi, cleaner, subscriptions, and monthly shared bills are common use cases and still manual.

### 3. No export or handoff
Users cannot export group history, expense CSV, or a simple settlement summary.

### 4. No search/filter layer
As group history grows, finding an expense becomes tedious.

### 5. No read-only sharing mode
Sometimes users want to share the ledger with a parent, organizer, finance lead, or roommate who should not edit anything.

### 6. No receipt intelligence
Uploads are stored, but there is no OCR, no autofill, no validation, and no processing worker.

### 7. Backend payment support is ahead of product UX
There is Stripe infrastructure, but no clear product decision and no complete client-side payment experience.

## What Should Be Added Next
The right next features are the ones that reduce repeated user effort, improve trust, and avoid product bloat.

## Recommended Priority Order

### Tier 1: Must Add Soon
These are high-value and low-to-medium complexity.

#### A. Expense categories on mobile
Reason:

- backend already supports it
- web already has it
- unlocks future charts and summaries

#### B. Expense delete on web
Reason:

- core ledger correction workflow
- parity with mobile

#### C. Proper mobile receipt upload
Reason:

- current flow is incomplete for real users
- strong trust feature for shared expenses

#### D. Default split preferences on mobile
Reason:

- repeated-use groups benefit immediately
- reduces friction in the main action users perform most

#### E. Personal balance summary on web group detail
Reason:

- makes the desktop experience action-oriented instead of just informational

### Tier 2: Strong Bonus Features
These should be added after parity fixes.

#### A. Payment reminders
Keep this lightweight:

- remind one person
- remind all debtors in a group
- send push on mobile, email fallback if introduced later

Reason:

- solves follow-through, not math
- extremely practical

#### B. Recurring expenses
Keep the first version simple:

- monthly or weekly repeat
- fixed payer
- fixed participants
- editable before posting if needed

Reason:

- useful for rent, subscriptions, utilities
- competitors already train users to expect this

#### C. CSV export for a group
Reason:

- useful for trip reconciliation
- useful for house finance transparency
- low complexity compared with analytics dashboards

#### D. Search and filters
Start with:

- description
- payer
- category
- date range

Reason:

- prevents the app from feeling weak as history grows

### Tier 3: Nice To Have, But Only If The Basics Are Done

#### A. Receipt OCR autofill
Good feature, but only after receipt upload is stable.

Practical scope:

- extract merchant name
- extract total
- suggest category

#### B. Read-only guest/share access
Useful for trips and household coordinators.

#### C. Spending insights by category and member
Only after category coverage is consistent across mobile and web.

## Features To Avoid Right Now
These would likely overcomplicate the app relative to current maturity.

### 1. Full budgeting suite
FairShare is a shared-expense tool, not a full personal finance app.

### 2. Complex in-app wallets
This adds compliance, reconciliation, and support burden quickly.

### 3. Heavy social features
Comments, reactions, feeds, badges, and gamification do not solve the main problem.

### 4. Too many split modes
The app already supports the right base models:

- equal
- exact
- percentage

Add complexity only if a concrete user pattern demands it.

## Market Research Notes
Checked on March 27, 2026 using current public product sources.

### Observed Competitor Patterns

#### Splitwise
Commonly associated in market positioning with:

- reminders
- receipt scanning
- currency conversion
- connected payment rails

Implication for FairShare:

- reminders and receipts are not "extra" features anymore
- users increasingly expect the app to help them actually settle, not just calculate

Source:

- https://www.investopedia.com/articles/company-insights/090816/how-splitwise-works-and-makes-money.asp

#### Tricount
Official use-case pages emphasize:

- offline expense entry
- receipt capture
- payment requests/reminders

Implication for FairShare:

- mobile offline support is a real advantage worth preserving
- reminders are a practical next addition, not feature bloat

Source:

- https://tricount.com/en-us/expense-tracker-use-cases/camps

#### Settle Up
The current App Store listing highlights:

- CSV export
- read-only access
- receipt photos
- categories
- recurring transactions

Implication for FairShare:

- export is a practical table-stakes utility
- recurring expenses are expected for roommate and household use cases
- categories become more valuable once they are consistent across both clients

Source:

- https://apps.apple.com/us/app/settle-up-group-expenses/id737534985

## Practical Product Recommendations
If the goal is to solve real user problems without making the app feel bloated, the most defensible additions are:

1. Mobile expense categories
2. Web expense delete
3. Proper mobile receipt upload
4. Mobile default split preferences
5. Web personal balance summary
6. Payment reminders
7. Recurring expenses
8. CSV export
9. Search/filter

That list stays close to the product's core promise:

- enter expenses quickly
- understand who owes what
- settle with less friction
- keep proof when needed

## Suggested Rollout Plan

### Phase 1: Parity And Core Trust
- add mobile categories
- add web delete expense
- add proper mobile receipt upload
- add web personal balance summary

### Phase 2: Repeated-Use Efficiency
- add mobile default split preferences
- add recurring expenses
- add search/filter

### Phase 3: Follow-Through
- add reminders
- add CSV export
- add optional read-only share mode

### Phase 4: Smart Features
- add receipt OCR/autofill
- add category insights/charts

## Status Update

- **Done since last update:** added reminders with activity history, grouped recurring bills by urgency, improved dashboard attention queues/activity feed, surfaced balance status badges, created overdue-recurring indicators, and polished recurring due-date grouping across both clients (see commits affecting `apps/web/src/components/groups/*`, `apps/web/app/dashboard/*`, and `apps/mobile/app/screens/*`).
- **Left on the near horizon:** recurring insights on dashboards, more settlement settlement completion context directly in alerts, and the shared export/search layer still needs polished flows even after the earlier CSV/export work.

## Final Recommendation
Do not broaden FairShare into a generic fintech app.

The best near-term strategy is:

- close the mobile/web parity gaps
- improve recurring high-frequency actions
- add only the market-proven features that reduce user effort

If only five items are chosen next, they should be:

1. mobile categories
2. web delete expense
3. proper mobile receipt upload
4. reminders
5. recurring expenses

Those five improve correctness, speed, and follow-through without changing the product into something larger than it needs to be.
