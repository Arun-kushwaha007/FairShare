import { CreateExpenseRequestDto, ExpenseDto, UpdateExpenseRequestDto, PresignedReceiptUrlResponseDto } from '@fairshare/shared-types';
import { api } from './api';

export const expenseService = {
  create: async (groupId: string, payload: CreateExpenseRequestDto) => (await api.post<ExpenseDto>(`/groups/${groupId}/expenses`, payload)).data,
  list: async (groupId: string) => (await api.get<ExpenseDto[]>(`/groups/${groupId}/expenses`)).data,
  get: async (expenseId: string) => (await api.get<ExpenseDto>(`/expenses/${expenseId}`)).data,
  update: async (expenseId: string, payload: UpdateExpenseRequestDto) => (await api.patch<ExpenseDto>(`/expenses/${expenseId}`, payload)).data,
  remove: async (expenseId: string) => (await api.delete(`/expenses/${expenseId}`)).data,
  createReceiptUploadUrl: async (expenseId: string) =>
    (await api.post<PresignedReceiptUrlResponseDto>(`/expenses/${expenseId}/receipt-url`, {})).data,
};
