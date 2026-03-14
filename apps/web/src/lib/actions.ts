'use server';

import { cookies } from 'next/headers';
import { getBackendBaseUrl } from './env';
import { authCookies } from './authCookies';

export async function inviteMemberAction(groupId: string, email: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;
  
  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Failed to invite member'),
    };
  }

  return { success: true };
}
