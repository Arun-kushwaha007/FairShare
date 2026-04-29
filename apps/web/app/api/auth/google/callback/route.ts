import { NextRequest, NextResponse } from 'next/server';
import { accessCookieOptions, authCookies, refreshCookieOptions } from '../../../../../src/lib/authCookies';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');

  const redirectUrl = new URL('/dashboard', request.url);

  if (!accessToken || !refreshToken) {
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('error', 'OAuth authentication failed');
    return NextResponse.redirect(redirectUrl);
  }

  const response = NextResponse.redirect(redirectUrl);
  
  response.cookies.set(authCookies.accessToken, accessToken, accessCookieOptions);
  response.cookies.set(authCookies.refreshToken, refreshToken, refreshCookieOptions);

  return response;
}
