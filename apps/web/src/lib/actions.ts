'use server';

import {
  CreateExpenseRequestDto,
  CreateGroupRequestDto,
  CreateSettlementRequestDto,
  ExpenseDto,
  GroupDto,
  PresignedReceiptUrlResponseDto,
  RecurringExpenseDto,
  RemindSettlementRequestDto,
  RemindSettlementResponseDto,
  SettlementDto,
  UpdateExpenseRequestDto,
  UpdateGroupDefaultSplitRequestDto,
  UpdateRecurringExpenseRequestDto,
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
      message: Array.isArray(data.message)
        ? data.message[0]
        : data.message || 'Failed to invite member',
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

export async function updateRecurringExpenseAction(
  recurringExpenseId: string,
  payload: UpdateRecurringExpenseRequestDto,
) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/recurring-expenses/${recurringExpenseId}`, {
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
      message: data?.message ?? 'Failed to update recurring expense',
    };
  }

  return { success: true, recurringExpense: data as RecurringExpenseDto };
}

export async function updateGroupDefaultSplitAction(
  groupId: string,
  payload: UpdateGroupDefaultSplitRequestDto,
) {
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
  const idempotencyKey = crypto.randomUUID();

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/settlements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-idempotency-key': idempotencyKey,
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

  return { ...(data as RemindSettlementResponseDto), success: true };
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

export async function exportExpensesCsvAction(groupId: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/expenses/export.csv`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.text().catch(() => '');

  if (!response.ok) {
    return { success: false, message: data || 'Failed to export CSV' };
  }

  return { success: true, csv: data };
}

export async function exportBalancesCsvAction(groupId: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/balances/export.csv`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.text().catch(() => '');

  if (!response.ok) {
    return { success: false, message: data || 'Failed to export balances CSV' };
  }

  return { success: true, csv: data };
}

export async function listRecurringExpensesAction(groupId: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/recurring-expenses`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, message: data?.message ?? 'Failed to load recurring expenses' };
  }

  return { success: true, recurringExpenses: data as RecurringExpenseDto[] };
}

export async function deleteRecurringExpenseAction(recurringExpenseId: string) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/recurring-expenses/${recurringExpenseId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, message: data?.message ?? 'Failed to remove recurring expense' };
  }

  return { success: true };
}

export async function toggleGroupShareAction(groupId: string, enabled: boolean) {
  const token = (await cookies()).get(authCookies.accessToken)?.value;

  const response = await fetch(`${getBackendBaseUrl()}/groups/${groupId}/share`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ enabled }),
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return { success: false, message: data?.message ?? 'Failed to toggle group share' };
  }

  return { success: true, group: data as GroupDto };
}
