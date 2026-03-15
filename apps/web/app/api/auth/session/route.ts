import { NextResponse } from 'next/server';
import { backendFetch } from '../../../../src/lib/backend';
import { AuthUserDto } from '@fairshare/shared-types';

export async function GET() {
  try {
    const user = await backendFetch<AuthUserDto>('/users/me');
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
