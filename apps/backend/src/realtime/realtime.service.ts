import { Injectable } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

type GroupEvent =
  | 'expense_created'
  | 'expense_deleted'
  | 'settlement_created'
  | 'group_member_joined';

@Injectable()
export class RealtimeService {
  constructor(private readonly gateway: RealtimeGateway) {}

  emitToGroup(groupId: string, event: GroupEvent, payload: Record<string, unknown>): void {
    this.gateway.server.to(`group:${groupId}`).emit(event, payload);
  }
}
