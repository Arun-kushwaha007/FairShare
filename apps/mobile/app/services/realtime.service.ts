import { io, Socket } from 'socket.io-client';
import { useExpenseStore } from '../store/expenseStore';
import { expenseService } from './expense.service';

type RealtimeEvent = 'expense_created' | 'expense_deleted' | 'settlement_created' | 'group_member_joined';

class RealtimeService {
  private socket: Socket | null = null;
  private baseUrl = '';

  connect(apiUrl: string, token: string): void {
    const parsed = new URL(apiUrl);
    const origin = `${parsed.protocol}//${parsed.host}`;
    if (this.socket && this.baseUrl === origin) {
      return;
    }

    this.disconnect();
    this.baseUrl = origin;
    this.socket = io(origin, {
      transports: ['websocket'],
      auth: { token },
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinGroup(groupId: string): void {
    this.socket?.emit('join_group', { groupId });
  }

  leaveGroup(groupId: string): void {
    this.socket?.emit('leave_group', { groupId });
  }

  subscribeGroupRefresh(groupId: string): () => void {
    const handlers: Array<[RealtimeEvent, () => void]> = [];
    const refresh = async () => {
      const setExpenses = useExpenseStore.getState().setExpenses;
      const list = await expenseService.list(groupId);
      setExpenses(groupId, list.items);
    };

    (['expense_created', 'expense_deleted', 'settlement_created', 'group_member_joined'] as RealtimeEvent[]).forEach(
      (event) => {
        const handler = () => {
          void refresh();
        };
        handlers.push([event, handler]);
        this.socket?.on(event, handler);
      },
    );

    return () => {
      handlers.forEach(([event, handler]) => this.socket?.off(event, handler));
    };
  }
}

export const realtimeService = new RealtimeService();
