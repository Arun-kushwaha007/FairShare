import { CreateSettlementRequestDto, SettlementDto } from '@fairshare/shared-types';
import { api } from './api';

export const settlementService = {
  create: async (groupId: string, payload: CreateSettlementRequestDto) =>
    (await api.post<SettlementDto>(`/groups/${groupId}/settlements`, payload)).data,
};
