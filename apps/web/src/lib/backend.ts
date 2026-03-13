import 'server-only';

import { cookies } from 'next/headers';
import { getBackendBaseUrl } from './env';
import { authCookies } from './authCookies';

export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = (await cookies()).get(authCookies.accessToken)?.value;
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

