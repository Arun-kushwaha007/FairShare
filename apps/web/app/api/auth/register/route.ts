import { NextResponse } from 'next/server';
import { accessCookieOptions, authCookies, refreshCookieOptions } from '../../../../src/lib/authCookies';
import { getBackendBaseUrl } from '../../../../src/lib/env';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const response = await fetch(`${getBackendBaseUrl()}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { accessToken?: string; refreshToken?: string; user?: unknown; message?: string }
    | null;

  if (!response.ok || !payload?.accessToken || !payload?.refreshToken) {
    return NextResponse.json(
      { message: payload?.message ?? 'Registration failed' },
      { status: response.status || 400 },
    );
  }

  const res = NextResponse.json({ user: payload.user ?? null });
  res.cookies.set(authCookies.accessToken, payload.accessToken, accessCookieOptions);
  res.cookies.set(authCookies.refreshToken, payload.refreshToken, refreshCookieOptions);
  return res;
}
