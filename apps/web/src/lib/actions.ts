'use server';

import {
  CreateExpenseRequestDto,
  ExpenseDto,
  CreateSettlementRequestDto,
  SettlementDto,
  PresignedReceiptUrlResponseDto,
} from '@fairshare/shared-types';
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

export async function createExpenseAction(groupId: string, payload: CreateExpenseRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      message: data?.message ?? 'Failed to create expense',
    };
  }

  return { success: true, expense: data as ExpenseDto };
}

export async function createSettlementAction(groupId: string, payload: CreateSettlementRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/settlements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      success: false,
      message: data?.message ?? 'Failed to record settlement',
    };
  }

  return { success: true, settlement: data as SettlementDto };
}

export async function createReceiptUrlAction(expenseId: string, extension?: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/expenses/${expenseId}/receipt-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(extension ? { extension } : {}),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, message: data?.message ?? 'Failed to create receipt upload URL' };
  }

  return { success: true, presign: data as PresignedReceiptUrlResponseDto };
}
