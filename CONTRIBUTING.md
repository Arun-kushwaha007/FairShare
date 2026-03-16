# Contributing to FairShare

Thanks for helping improve FairShare. This guide covers setup, workflow, and contribution standards.

## Setup
1. Install dependencies:
```
pnpm install
```
2. Create environment files:
```
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
```
3. Start local services:
```
docker-compose up -d
```
4. Run apps:
```
pnpm dev
```

## Project Structure
- `apps/backend`: NestJS API
- `apps/web`: Next.js dashboard
- `apps/mobile`: Expo app
- `packages/shared-types`: shared types across apps

## Branching and Commits
- Create a feature branch from `main`.
- Keep commits focused and readable.
- Use conventional commit style when possible:
  - `feat(scope): message`
  - `fix(scope): message`
  - `chore(scope): message`

## Code Style
- TypeScript everywhere
- Keep UI changes consistent with existing design tokens
- Avoid introducing new dependencies unless necessary
- Prefer shared types in `packages/shared-types`

## Testing
Run what applies to your change:
```
pnpm lint
pnpm test
pnpm --filter web build
```

## Pull Request Checklist
- Changes compile and relevant tests pass
- Screenshots for UI changes (web/mobile)
- No secrets or credentials committed
- Updated README/docs if behavior changed

## Security Checklist
- Never commit `.env` or real credentials
- Use placeholders or local-only values for compose/dev configs
- Avoid logging tokens or sensitive payloads
- Rotate keys immediately if a secret is exposed
- Keep dependencies updated and audited

## Reporting Issues
When filing a bug, include:
- Reproduction steps
- Expected vs actual behavior
- Logs or screenshots
- App version and environment
