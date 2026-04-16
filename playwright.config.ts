import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testMatch: /fairshare\.spec\.ts/,
      use: {
        baseURL: process.env.E2E_API_BASE_URL ?? 'http://localhost:3001/api/v1',
      },
    },
    {
      name: 'web',
      testMatch: /dashboard\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_URL ?? 'http://localhost:3000',
      },
    },
  ],
  webServer: process.env.CI
    ? [
        {
          command: 'pnpm --filter backend start',
          port: 3001,
          timeout: 180_000,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: 'pnpm --filter web start',
          port: 3000,
          timeout: 180_000,
          reuseExistingServer: !process.env.CI,
        },
      ]
    : undefined,
});
