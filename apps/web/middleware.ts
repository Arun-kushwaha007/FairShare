import { NextRequest, NextResponse } from 'next/server';
import { authCookies, accessCookieOptions, refreshCookieOptions } from './src/lib/authCookies';
import { getBackendBaseUrl } from './src/lib/env';
import { isJwtExpiringSoon } from './src/lib/jwt';

function isProtectedPath(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

function isAuthPage(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register';
}

function parseCookieValue(setCookieHeader: string | null, cookieName: string): string | null {
  if (!setCookieHeader) return null;
  const idx = setCookieHeader.indexOf(`${cookieName}=`);
  if (idx < 0) return null;
  const start = idx + cookieName.length + 1;
  const end = setCookieHeader.indexOf(';', start);
  return (end < 0 ? setCookieHeader.slice(start) : setCookieHeader.slice(start, end)).trim() || null;
}

async function tryRefreshTokens(req: NextRequest): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = req.cookies.get(authCookies.refreshToken)?.value;
  if (!refreshToken) {
    return null;
  }

  let csrfResp: Response;
  try {
    csrfResp = await fetch(`${getBackendBaseUrl()}/auth/csrf-token`, {
      method: 'GET',
      headers: { cookie: `${authCookies.refreshToken}=${refreshToken}` },
      cache: 'no-store',
    });
  } catch {
    return null;
  }

  if (!csrfResp.ok) {
    return null;
  }

  const csrfPayload = (await csrfResp.json().catch(() => null)) as { csrfToken?: string } | null;
  const csrfToken = csrfPayload?.csrfToken;
  if (!csrfToken) {
    return null;
  }

  const csrfCookie = parseCookieValue(csrfResp.headers.get('set-cookie'), '_csrf');
  if (!csrfCookie) {
    return null;
  }

  let refreshResp: Response;
  try {
    refreshResp = await fetch(`${getBackendBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
        cookie: `_csrf=${csrfCookie}; ${authCookies.refreshToken}=${refreshToken}`,
      },
      cache: 'no-store',
    });
  } catch {
    return null;
  }

  if (!refreshResp.ok) {
    return null;
  }

  const refreshPayload = (await refreshResp.json().catch(() => null)) as
    | { accessToken?: string; refreshToken?: string }
    | null;
  if (!refreshPayload?.accessToken || !refreshPayload?.refreshToken) {
    return null;
  }

  return { accessToken: refreshPayload.accessToken, refreshToken: refreshPayload.refreshToken };
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const accessToken = req.cookies.get(authCookies.accessToken)?.value ?? null;

  if (isAuthPage(pathname) && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (!isJwtExpiringSoon(accessToken, 60_000)) {
    return NextResponse.next();
  }

  const refreshed = await tryRefreshTokens(req);
  if (!refreshed) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.cookies.set(authCookies.accessToken, refreshed.accessToken, accessCookieOptions);
  res.cookies.set(authCookies.refreshToken, refreshed.refreshToken, refreshCookieOptions);
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
