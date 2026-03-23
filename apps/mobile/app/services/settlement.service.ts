import { CreateSettlementRequestDto, SettlementDto } from '@fairshare/shared-types';
import { api } from './api';
import { generateIdempotencyKey } from './idempotency';

export const settlementService = {
  create: async (groupId: string, payload: CreateSettlementRequestDto) =>
    (
      await api.post<SettlementDto>(`/groups/${groupId}/settlements`, payload, {
        headers: { 'x-idempotency-key': generateIdempotencyKey('settlement') },
      })
    ).data,
};
