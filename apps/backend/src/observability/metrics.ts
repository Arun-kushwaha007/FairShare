import { Registry, collectDefaultMetrics, Counter, Gauge, Histogram } from 'prom-client';

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const apiLatency = new Histogram({
  name: 'fairshare_api_latency_ms',
  help: 'API latency in milliseconds',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [25, 50, 100, 200, 500, 1000, 2000, 5000],
  registers: [registry],
});

const apiErrors = new Counter({
  name: 'fairshare_api_errors_total',
  help: 'Total API errors',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [registry],
});

const expenseCreation = new Counter({
  name: 'fairshare_expense_creation_total',
  help: 'Total expenses created',
  labelNames: ['group_id'] as const,
  registers: [registry],
});

const activeUsers = new Gauge({
  name: 'fairshare_active_users',
  help: 'Estimated active users from non-revoked refresh tokens',
  registers: [registry],
});

export function observeApiRequest(method: string, route: string, status: number, durationMs: number): void {
  apiLatency.labels(method, route, String(status)).observe(durationMs);
  if (status >= 500) {
    apiErrors.labels(method, route, String(status)).inc();
  }
}

export function incrementExpenseCreated(groupId: string): void {
  expenseCreation.labels(groupId).inc();
}

export function setActiveUsers(value: number): void {
  activeUsers.set(value);
}

export async function getMetrics(): Promise<string> {
  return registry.metrics();
}
