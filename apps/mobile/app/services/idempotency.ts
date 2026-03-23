function createFallbackId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function generateIdempotencyKey(scope: 'expense' | 'settlement'): string {
  const cryptoApi = (globalThis as typeof globalThis & { crypto?: { randomUUID?: () => string } }).crypto;
  const randomId = typeof cryptoApi?.randomUUID === 'function' ? cryptoApi.randomUUID() : createFallbackId();

  return `mobile:${scope}:${randomId}`;
}
