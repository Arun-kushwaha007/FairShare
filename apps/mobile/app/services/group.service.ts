import {
  ActivityDto,
  CreateGroupRequestDto,
  GroupDto,
  GroupMemberSummaryDto,
  GroupSummaryDto,
  InviteMemberRequestDto,
  type UpdateGroupDefaultSplitRequestDto,
} from '@fairshare/shared-types';
import { api } from './api';

export const groupService = {
  create: async (payload: CreateGroupRequestDto) => (await api.post<GroupDto>('/groups', payload)).data,
  list: async () => (await api.get<GroupDto[]>('/groups')).data,
  get: async (id: string) => (await api.get<GroupDto>(`/groups/${id}`)).data,
  members: async (id: string) => (await api.get<GroupMemberSummaryDto[]>(`/groups/${id}/members`)).data,
  summary: async (id: string) => (await api.get<GroupSummaryDto>(`/groups/${id}/summary`)).data,
  updateDefaultSplit: async (id: string, payload: UpdateGroupDefaultSplitRequestDto) =>
    (await api.patch<GroupDto>(`/groups/${id}/default-split`, payload)).data,
  invite: async (id: string, payload: InviteMemberRequestDto) => (await api.post(`/groups/${id}/invite`, payload)).data,
  balances: async (id: string) => (await api.get(`/groups/${id}/balances`)).data,
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
};
