# Contributing to FairShare

Thanks for helping improve FairShare. This guide covers setup, workflow, and contribution standards.

## Getting Started (for Beginners)

This section explains how to start contributing if you're new to the project or open source in general.

### 1. Fork the Repository

Click the **Fork** button at the top-right of the repository page to create your own copy of the codebase.

### 2. Clone Your Fork

Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/FairShare.git
cd FairShare
```

*Replace `YOUR_USERNAME` with your GitHub username.*

### 3. Set Up Upstream

Keep your fork in sync with the main project:

```bash
git remote add upstream https://github.com/Arun-kushwaha007/FairShare.git
```

### 4. Create a Branch

Always create a new branch for your work. Use the following naming standard:

- `feat/your-feature-name` (for new features)
- `fix/bug-description` (for bug fixes)
- `docs/what-changed` (for documentation updates)

```bash
git checkout -b feat/add-new-feature
```

### 5. Make Changes & Commit

After making your changes, stage and commit them. Follow the conventional commit style (see below).

```bash
git add .
git commit -m "feat(scope): add helpful description"
```

### 6. Push & Pull Request

Push your changes to your fork and open a Pull Request (PR) on the main repository.

```bash
git push origin feat/add-new-feature
```

Go to the original repository on GitHub, and you'll see a "Compare & pull request" button.

---

## Setup

1. Install dependencies:

```bash
pnpm install
```

1. Create environment files:

```bash
cp .env.example .env
cp apps/mobile/.env.example apps/mobile/.env
```

1. Start local services:

```bash
docker-compose up -d
```

1. Run apps:

```bash
pnpm dev
```

## Projects Structure

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

```bash
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
