import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  use: {
    baseURL: process.env.E2E_API_BASE_URL ?? 'http://localhost:3001/api/v1',
  },
});
