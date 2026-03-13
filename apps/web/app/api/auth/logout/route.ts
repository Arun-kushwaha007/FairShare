import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authCookies } from '../../../../src/lib/authCookies';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(authCookies.accessToken, '', { httpOnly: true, path: '/', maxAge: 0 });
  cookieStore.set(authCookies.refreshToken, '', { httpOnly: true, path: '/', maxAge: 0 });
  return NextResponse.json({ ok: true }, { status: 200 });
}

