# 💸 FairShare

**A Production-Grade Monorepo for Collaborative Expense Sharing.**

FairShare is a high-performance, full-stack solution designed for seamless expense tracking and settlement. Built with a modern TypeScript-first architecture, it provides a unified experience across mobile, web, and backend services.

---

## 🚀 Overview

FairShare simplifies communal living and shared adventures. Whether you're splitting rent with roommates or tracking costs on a group trip, FairShare provides the tools to handle complex splits, automate settlements via UPI, and maintain real-time visibility into balances.

### Key Highlights

- **Cross-Platform**: Expo-powered mobile app and Next.js web dashboard.
- **Robust Backend**: Scalable NestJS microservice with Prisma and Supabase.
- **Financial Integrity**: High-precision BigInt arithmetic for accurate penny-perfect splits.
- **Production Ready**: Fully Dockerized, Terraform-orchestrated, and CI/CD-integrated.

---

## 🛠 Tech Stack

### Backend

- **Framework**: NestJS (TypeScript strict)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Caching**: Redis (BullMQ for async jobs)
- **Storage**: AWS S3 (Receipts & Assets)
- **Security**: JWT Rotation, Google OAuth, Helmet, CSRF Protection
- **Observability**: Prometheus metrics + Sentry + OpenTelemetry

### Mobile

- **Framework**: Expo Router (React Native)
- **Styling**: React Native Paper + Reanimated animations
- **State/Networking**: Axios + Socket.io + TanStack Query (planned)
- **Native Hooks**: Haptic feedback, Lottie animations, UPI Deep-linking

### Web

- **Framework**: Next.js
- **Styling**: TailwindCSS + Framer Motion
- **SEO**: Dynamic metadata & SSR optimized

---

## 📁 Project Structure

This project uses **Turborepo** and **pnpm** for workspace management:

```text
FairShare/
├── apps/
│   ├── backend/      # NestJS API Service
│   ├── mobile/       # Expo / React Native App
│   └── web/          # Next.js Marketing & Dashboard
├── packages/
│   └── shared-types/ # Shared TS interfaces & Zod schemas
├── infra/            # Terraform modules (AWS ECS, RDS, S3)
└── scripts/          # Automation & seeding utilities
```

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v8+)
- [Docker](https://www.docker.com/) (for local services)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Arun-kushwaha007/FairShare.git
   cd FairShare
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Environment Setup**:

   Copy `.env.example` to `.env` in the root and within `apps/backend/`.

   ```bash
   cp .env.example .env
   ```

   > [!IMPORTANT]
   > The backend requires several mandatory environment variables to bootstrap successfully. Ensure the following are set in `apps/backend/.env`:
   > - `SUPABASE_DATABASE_URL`: Your PostgreSQL connection string.
   > - `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure strings for token signing.
   > - `STRIPE_SECRET_KEY`: Required for the payments module (starts with `sk_test_`).
   > - `STRIPE_WEBHOOK_SECRET`: Required for processing payment events (starts with `whsec_`).
   > - `GOOGLE_CLIENT_ID` & `SECRET`: For OAuth integration.

4. **Start Development Services**:

   ```bash
   # Start DB, Redis via Docker
   docker-compose up -d
   
   # Run all apps in dev mode (Turbo)
   pnpm dev
   ```

### 💻 Developing Locally

You can also start specific services individually using the following commands from the root:

| Service | Command | Description |
| :--- | :--- | :--- |
| **All Service** | `pnpm dev` | Starts Backend, Mobile, and Web in parallel via Turbo. |
| **Backend** | `pnpm dev:backend` | Starts the NestJS API with hot reload. |
| **Mobile** | `pnpm dev:mobile` | Starts the Expo development server (Expo Go). |
| **Web** | `pnpm dev:web` | Starts the Next.js development server. |
| **Seeding** | `pnpm seed` | Populates the database with initial development data. |
| **Building Mobile** | `pnpm mobile:build` | Triggers EAS build for production AAB/IPA. |

---

## 🔋 Core Features

- **Advanced Split Logic**: Supports equal, exact, and percentage-based splits.
- **Fast Settlements**: Greedy simplification algorithm to minimize total payments.
- **Real-time Activity**: Live updates via WebSockets for group actions.
- **Offline Resilience**: Mobile-first architecture with offline queuing for expense entry.
- **Push Notifications**: Intelligent reminders for pending settlements via Expo.

---

## 🚢 Infrastructure & Deployment

- **CI/CD**: GitHub Actions for automated type-checking, linting, and Playwright E2E testing.
- **Cloud Hosting**: AWS ECS (Fargate) for backend, Vercel/Netlify for web, and EAS for mobile.
- **IaC**: Terraform-managed VPC, ECS Cluster, RDS, and S3 buckets.

---

## 📄 License & Documentation

Refer to [doc.md](doc.md) for detailed technical architecture and production launch notes.

---

*Developed with ❤️ by the FairShare Team.*
