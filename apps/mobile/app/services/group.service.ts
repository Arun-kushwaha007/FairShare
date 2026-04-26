import {
  ActivityDto,
  CreateGroupRequestDto,
  GroupDto,
  GroupMemberSummaryDto,
  GroupSummaryDto,
  InviteMemberRequestDto,
  RemindSettlementRequestDto,
  RemindSettlementResponseDto,
  type UpdateGroupDefaultSplitRequestDto,
} from '@fairshare/shared-types';
import { api } from './api';
import { generateIdempotencyKey } from './idempotency';

export const groupService = {
  create: async (payload: CreateGroupRequestDto) =>
    (
      await api.post<GroupDto>('/groups', payload, {
        headers: { 'x-idempotency-key': generateIdempotencyKey('mutation') },
      })
    ).data,
  list: async () => (await api.get<GroupDto[]>('/groups')).data,
  get: async (id: string) => (await api.get<GroupDto>(`/groups/${id}`)).data,
  members: async (id: string) =>
    (await api.get<GroupMemberSummaryDto[]>(`/groups/${id}/members`)).data,
  summary: async (id: string) => (await api.get<GroupSummaryDto>(`/groups/${id}/summary`)).data,
  updateDefaultSplit: async (id: string, payload: UpdateGroupDefaultSplitRequestDto) =>
    (await api.patch<GroupDto>(`/groups/${id}/default-split`, payload)).data,
  invite: async (id: string, payload: InviteMemberRequestDto) =>
    (
      await api.post(`/groups/${id}/invite`, payload, {
        headers: { 'x-idempotency-key': generateIdempotencyKey('mutation') },
      })
    ).data,
  remindSettlement: async (id: string, payload: RemindSettlementRequestDto) =>
    (await api.post<RemindSettlementResponseDto>(`/groups/${id}/remind-settlement`, payload)).data,
  balances: async (id: string) => (await api.get(`/groups/${id}/balances`)).data,
  exportBalancesCsv: async (id: string) =>
    (await api.get<string>(`/groups/${id}/balances/export.csv`)).data,
  userSummary: async () => (await api.get<{ totalBalanceCents: string }>('/groups/summary')).data,
  simplify: async (id: string) => (await api.get(`/groups/${id}/simplify`)).data,
  activity: async (id: string, cursor = 0, limit = 20) =>
    (
      await api.get<{ items: ActivityDto[]; nextCursor: number | null }>(`/activity/group/${id}`, {
        params: { cursor, limit },
      })
    ).data,
  userActivity: async (cursor = 0, limit = 20) =>
    (
      await api.get<{ items: ActivityDto[]; nextCursor: number | null }>('/activity', {
        params: { cursor, limit },
      })
    ).data,
  
  // Guest methods
  getGuest: async (token: string) => (await api.get<GroupDto>(`/guest/groups/${token}`)).data,
  guestExpenses: async (token: string, limit = 50) => 
    (await api.get(`/guest/groups/${token}/expenses`, { params: { limit } })).data,
  guestSummary: async (token: string) => 
    (await api.get<GroupSummaryDto>(`/guest/groups/${token}/summary`)).data,
  guestActivity: async (token: string, cursor = 0, limit = 20) =>
    (
      await api.get<{ items: ActivityDto[]; nextCursor: number | null }>(`/guest/groups/${token}/activity`, {
        params: { cursor, limit },
      })
    ).data,
  guestMembers: async (token: string) =>
    (await api.get<GroupMemberSummaryDto[]>(`/guest/groups/${token}/members`)).data,
};
