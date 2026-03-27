import {
  CreateExpenseRequestDto,
  ExpenseDto,
  UpdateExpenseRequestDto,
  PresignedReceiptUrlResponseDto,
  PaginatedExpensesResponseDto,
} from '@fairshare/shared-types';
import { api } from './api';
import { generateIdempotencyKey } from './idempotency';

export const expenseService = {
  create: async (groupId: string, payload: CreateExpenseRequestDto) =>
    (
      await api.post<ExpenseDto>(`/groups/${groupId}/expenses`, payload, {
        headers: { 'x-idempotency-key': generateIdempotencyKey('expense') },
      })
    ).data,
  list: async (groupId: string, cursor = 0, limit = 20) =>
    (
      await api.get<PaginatedExpensesResponseDto>(`/groups/${groupId}/expenses`, {
        params: { cursor, limit },
      })
    ).data,
  get: async (expenseId: string) => (await api.get<ExpenseDto>(`/expenses/${expenseId}`)).data,
  update: async (expenseId: string, payload: UpdateExpenseRequestDto) =>
    (await api.patch<ExpenseDto>(`/expenses/${expenseId}`, payload)).data,
  remove: async (expenseId: string) => (await api.delete(`/expenses/${expenseId}`)).data,
  createReceiptUploadUrl: async (expenseId: string, extension?: string) =>
    (await api.post<PresignedReceiptUrlResponseDto>(`/expenses/${expenseId}/receipt-url`, extension ? { extension } : {})).data,
};
