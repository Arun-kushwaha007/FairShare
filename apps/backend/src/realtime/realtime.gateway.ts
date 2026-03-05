import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type GroupRoomPayload = { groupId: string };

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`client_connected socketId=${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`client_disconnected socketId=${client.id}`);
  }

  @SubscribeMessage('join_group')
  handleJoinGroup(@ConnectedSocket() client: Socket, @MessageBody() payload: GroupRoomPayload): { ok: boolean } {
    if (!payload?.groupId) {
      return { ok: false };
    }
    client.join(`group:${payload.groupId}`);
    return { ok: true };
  }

  @SubscribeMessage('leave_group')
  handleLeaveGroup(@ConnectedSocket() client: Socket, @MessageBody() payload: GroupRoomPayload): { ok: boolean } {
    if (!payload?.groupId) {
      return { ok: false };
    }
    client.leave(`group:${payload.groupId}`);
    return { ok: true };
  }
}
