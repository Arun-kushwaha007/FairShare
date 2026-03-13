import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendBaseUrl } from '../../../../src/lib/env';
import { accessCookieOptions, authCookies, refreshCookieOptions } from '../../../../src/lib/authCookies';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  user?: unknown;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const response = await fetch(`${getBackendBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const payloadText = await response.text();
  if (!response.ok) {
    // Pass through backend status/message without leaking tokens.
    return new NextResponse(payloadText, { status: response.status });
  }

  const payload = JSON.parse(payloadText) as AuthTokens;

  const cookieStore = await cookies();
  cookieStore.set(authCookies.accessToken, payload.accessToken, accessCookieOptions);
  cookieStore.set(authCookies.refreshToken, payload.refreshToken, refreshCookieOptions);

  return NextResponse.json({ user: payload.user ?? null }, { status: 200 });
}

