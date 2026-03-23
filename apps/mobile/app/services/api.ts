import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { ApiError } from '../types/api-error';
import { offlineQueue } from '../utils/offlineQueue';
import { trackApiLatency } from '../utils/perf';

type ExpoConstantsDevHostShape = {
  manifest2?: {
    extra?: {
      expoClient?: {
        hostUri?: string;
      };
    };
  };
  manifest?: {
    debuggerHost?: string;
  };
};

function readIdempotencyHeader(headers: unknown): string | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }

  const value = (headers as Record<string, unknown>)['x-idempotency-key'];
  return typeof value === 'string' ? value : undefined;
}

function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const constants = Constants as unknown as ExpoConstantsDevHostShape;
  const hostUri = constants.manifest2?.extra?.expoClient?.hostUri ?? constants.manifest?.debuggerHost;
  const host = hostUri?.split(':')[0];

  if (host && !host.endsWith('.exp.direct')) {
    return `http://${host}:3001/api/v1`;
  }

  return 'http://localhost:3001/api/v1';
}

const baseURL = resolveApiBaseUrl();
export const apiBaseUrl = baseURL;

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

offlineQueue.setRequestExecutor(async (request) => {
  await api.request({
    method: request.method,
    url: request.url,
    data: request.data,
    headers: {
      ...request.headers,
      'x-offline-retry': '1',
    },
  });
});

if (__DEV__) {
  // Helps debug real-device failures where localhost is unreachable.
  console.log('[api] baseURL:', baseURL);
  if (!process.env.EXPO_PUBLIC_API_URL && baseURL.includes('localhost')) {
    console.log(
      '[api] Set EXPO_PUBLIC_API_URL in apps/mobile/.env to your PC LAN IP, e.g. http://192.168.1.10:3001/api/v1',
    );
  }
}

api.interceptors.request.use(async (config) => {
  (config as typeof config & { metadata?: { startTs: number } }).metadata = { startTs: Date.now() };
  const token = await SecureStore.getItemAsync('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    console.log('[api] request:', config.method?.toUpperCase(), config.url);
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const startTs = (response.config as typeof response.config & { metadata?: { startTs: number } }).metadata?.startTs;
    if (startTs) {
      trackApiLatency(response.config.url, response.config.method, Date.now() - startTs);
    }
    if (__DEV__) {
      console.log('[api] response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    const startTs = (error?.config as { metadata?: { startTs: number } } | undefined)?.metadata?.startTs;
    if (startTs) {
      trackApiLatency(error?.config?.url, error?.config?.method, Date.now() - startTs);
    }

    const method = String(error?.config?.method ?? '').toUpperCase();
    const url = String(error?.config?.url ?? '');
    const retryMarked = error?.config?.headers?.['x-offline-retry'] === '1';
    const shouldQueue =
      !retryMarked &&
      method === 'POST' &&
      (url.includes('/groups/') && url.includes('/expenses') ||
        url.includes('/settlements') ||
        url.includes('/invite')) &&
      !error?.response;

    if (shouldQueue) {
      let data: unknown = error?.config?.data;
      const idempotencyKey = readIdempotencyHeader(error?.config?.headers);
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // Keep as-is if parsing fails.
        }
      }

      void offlineQueue.enqueue({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        method: 'POST',
        url,
        data,
        headers: idempotencyKey ? { 'x-idempotency-key': idempotencyKey } : undefined,
      });
    }

    const wrapped: ApiError = {
      code: String(error?.response?.status ?? 'NETWORK_ERROR'),
      message:
        (error?.response?.data?.message as string | undefined) ??
        (typeof error?.message === 'string' ? error.message : 'Request failed') +
          (shouldQueue ? ' (queued for retry)' : ''),
      context: {
        status: error?.response?.status,
        url: error?.config?.url,
        method: error?.config?.method,
        responseData: error?.response?.data,
      },
    };

    if (__DEV__) {
      console.log('[api] error:', wrapped);
    }

    if (wrapped.context.status && wrapped.context.status >= 500) {
      Sentry.Native.captureException(new Error(wrapped.message), {
        extra: wrapped.context,
      });
    }

    return Promise.reject(wrapped);
  },
);
