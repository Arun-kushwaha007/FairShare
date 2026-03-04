import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(
    userIds: string[],
    payload: {
      title: string;
      body: string;
      data?: Record<string, unknown>;
    },
  ): Promise<void> {
    if (userIds.length === 0) {
      return;
    }

    this.logger.log(
      JSON.stringify({
        event: 'send_push_notification',
        userIds,
        payload,
      }),
    );
  }
}
