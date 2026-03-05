import { CreateGroupRequestDto, GroupDto, InviteMemberRequestDto, ActivityDto, GroupMemberSummaryDto, GroupSummaryDto } from '@fairshare/shared-types';
import { api } from './api';

export const groupService = {
  create: async (payload: CreateGroupRequestDto) => (await api.post<GroupDto>('/groups', payload)).data,
  list: async () => (await api.get<GroupDto[]>('/groups')).data,
  get: async (id: string) => (await api.get<GroupDto>(`/groups/${id}`)).data,
  members: async (id: string) => (await api.get<GroupMemberSummaryDto[]>(`/groups/${id}/members`)).data,
  summary: async (id: string) => (await api.get<GroupSummaryDto>(`/groups/${id}/summary`)).data,
  invite: async (id: string, payload: InviteMemberRequestDto) => (await api.post(`/groups/${id}/invite`, payload)).data,
  balances: async (id: string) => (await api.get(`/groups/${id}/balances`)).data,
  simplify: async (id: string) => (await api.get(`/groups/${id}/simplify`)).data,
  activity: async (id: string) => (await api.get<ActivityDto[]>(`/groups/${id}/activity`)).data,
};
