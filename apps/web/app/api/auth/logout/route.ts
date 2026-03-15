import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authCookies } from '../../../../src/lib/authCookies';
import { getBackendBaseUrl } from '../../../../src/lib/env';

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get(authCookies.refreshToken)?.value;

  if (refreshToken) {
    await fetch(`${getBackendBaseUrl()}/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: `${authCookies.refreshToken}=${refreshToken}`,
      },
      cache: 'no-store',
    }).catch(() => null);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(authCookies.accessToken);
  res.cookies.delete(authCookies.refreshToken);
  return res;
}
