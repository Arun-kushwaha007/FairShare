import { NextRequest, NextResponse } from 'next/server';
import { ActivityDto } from '@fairshare/shared-types';
import { backendFetch } from '../../../src/lib/backend';

type ActivityResponse = { items: ActivityDto[]; nextCursor: number | null };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor') ?? '0';
  const limit = searchParams.get('limit') ?? '20';
  const groupId = searchParams.get('groupId');

  const path = groupId
    ? `/activity/group/${encodeURIComponent(groupId)}?cursor=${cursor}&limit=${limit}`
    : `/activity?cursor=${cursor}&limit=${limit}`;

  try {
    const data = await backendFetch<ActivityResponse>(path);
    return NextResponse.json(data);
  } catch (error) {
    console.error('activity route failed', error);
    return NextResponse.json({ items: [], nextCursor: null }, { status: 500 });
  }
}
