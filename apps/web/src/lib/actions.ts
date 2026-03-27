'use server';

import {
  CreateExpenseRequestDto,
  CreateGroupRequestDto,
  CreateSettlementRequestDto,
  ExpenseDto,
  GroupDto,
  PresignedReceiptUrlResponseDto,
  RemindSettlementRequestDto,
  SettlementDto,
  UpdateExpenseRequestDto,
  UpdateGroupDefaultSplitRequestDto,
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
      message: Array.isArray(data.message) ? data.message[0] : data.message || 'Failed to invite member',
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

export async function updateExpenseAction(expenseId: string, payload: UpdateExpenseRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/expenses/${expenseId}`, {
    method: 'PATCH',
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
      message: data?.message ?? 'Failed to update expense',
    };
  }

  return { success: true, expense: data as ExpenseDto };
}

export async function updateGroupDefaultSplitAction(groupId: string, payload: UpdateGroupDefaultSplitRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/default-split`, {
    method: 'PATCH',
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
      message: data?.message ?? 'Failed to update default split',
    };
  }

  return { success: true, group: data as GroupDto };
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

export async function remindSettlementAction(groupId: string, payload: RemindSettlementRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/remind-settlement`, {
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
      message: data?.message ?? 'Failed to send reminder',
    };
  }

  return { success: true };
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

export async function createGroupAction(payload: CreateGroupRequestDto) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups`, {
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
    return { success: false, message: data?.message ?? 'Failed to create group' };
  }

  return { success: true, group: data as GroupDto };
}

export async function deleteExpenseAction(expenseId: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/expenses/${expenseId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, message: data?.message ?? 'Failed to delete expense' };
  }

  return { success: true };
}
