import * as Sentry from 'sentry-expo';

const screenStarts = new Map<string, number>();

export function startScreenLoad(screen: string): void {
  screenStarts.set(screen, Date.now());
}

export function endScreenLoad(screen: string): void {
  const startedAt = screenStarts.get(screen);
  if (!startedAt) {
    return;
  }

  const durationMs = Date.now() - startedAt;
  if (__DEV__) {
    console.log('[perf] screen_load', { screen, durationMs });
  }
  if (durationMs > 2000) {
    Sentry.Native.captureMessage('Slow screen load', {
      level: 'warning',
      extra: { screen, durationMs },
    });
  }
  screenStarts.delete(screen);
}

export function trackApiLatency(url: string | undefined, method: string | undefined, durationMs: number): void {
  if (__DEV__) {
    console.log('[perf] api_latency', { url, method, durationMs });
  }

  if (durationMs > 5000) {
    Sentry.Native.captureMessage('High API latency', {
      level: 'warning',
      extra: { url, method, durationMs },
    });
  } else if (durationMs > 1000) {
    Sentry.Native.captureMessage('API latency sample', {
      level: 'info',
      extra: { url, method, durationMs },
    });
  }
}
