import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authCookies } from '../../../../src/lib/authCookies';

export async function GET() {
  const token = (await cookies()).get(authCookies.accessToken)?.value ?? null;
  return NextResponse.json({ token });
}
