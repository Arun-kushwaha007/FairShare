import {
  CreateExpenseRequestDto,
  ExpenseDto,
  PaginatedExpensesResponseDto,
  PresignedReceiptUrlResponseDto,
  RecurringExpenseDto,
  UpdateExpenseRequestDto,
  UpdateRecurringExpenseRequestDto,
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
  exportCsv: async (groupId: string) =>
    (
      await api.get<string>(`/groups/${groupId}/expenses/export.csv`, {
        responseType: 'text',
      })
    ).data,
  listRecurring: async (groupId: string) => (await api.get<RecurringExpenseDto[]>(`/groups/${groupId}/recurring-expenses`)).data,
  get: async (expenseId: string) => (await api.get<ExpenseDto>(`/expenses/${expenseId}`)).data,
  update: async (expenseId: string, payload: UpdateExpenseRequestDto) =>
    (await api.patch<ExpenseDto>(`/expenses/${expenseId}`, payload)).data,
  updateRecurring: async (recurringExpenseId: string, payload: UpdateRecurringExpenseRequestDto) =>
    (await api.patch<RecurringExpenseDto>(`/recurring-expenses/${recurringExpenseId}`, payload)).data,
  remove: async (expenseId: string) => (await api.delete(`/expenses/${expenseId}`)).data,
  removeRecurring: async (recurringExpenseId: string) => (await api.delete(`/recurring-expenses/${recurringExpenseId}`)).data,
  createReceiptUploadUrl: async (expenseId: string, extension?: string) =>
    (await api.post<PresignedReceiptUrlResponseDto>(`/expenses/${expenseId}/receipt-url`, extension ? { extension } : {})).data,
};
