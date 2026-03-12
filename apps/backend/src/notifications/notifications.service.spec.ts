import { NotificationsService } from './notifications.service';

jest.mock('ioredis', () =>
  jest.fn().mockImplementation(() => ({
    publish: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    subscribe: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
);

describe('NotificationsService', () => {
  function createService() {
    const prisma: any = {
      pushToken: {
        findMany: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    };
    const jobsQueueService: any = {
      enqueueNotification: jest.fn().mockResolvedValue(undefined),
    };
    const config: any = {
      redisUrl: 'redis://localhost:6379',
    };
    const service = new NotificationsService(config, prisma, jobsQueueService);

    (service as any).publisher = {
      publish: jest.fn().mockResolvedValue(undefined),
      quit: jest.fn().mockResolvedValue(undefined),
    };
    (service as any).subscriber = {
      subscribe: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      quit: jest.fn().mockResolvedValue(undefined),
    };
    (service as any).expo = {
      chunkPushNotifications: jest.fn((messages) => [messages]),
      sendPushNotificationsAsync: jest.fn(),
    };

    return { service, prisma, jobsQueueService };
  }

  it('queues a notification event and background job', async () => {
    const { service, jobsQueueService } = createService();

    await service.sendPushNotification(['user-1'], {
      type: 'expense_created',
      title: 'Expense added',
      body: 'Dinner was added',
    });

    expect(jobsQueueService.enqueueNotification).toHaveBeenCalledWith({
      userIds: ['user-1'],
      payload: {
        type: 'expense_created',
        title: 'Expense added',
        body: 'Dinner was added',
      },
    });
  });

  it('removes invalid Expo tokens after a push send response', async () => {
    const { service, prisma } = createService();
    prisma.pushToken.findMany.mockResolvedValue([
      { token: 'ExponentPushToken[validToken]' },
      { token: 'ExponentPushToken[invalidToken]' },
    ]);
    (service as any).expo.sendPushNotificationsAsync.mockResolvedValue([
      { status: 'ok', id: 'ticket-1' },
      { status: 'error', details: { error: 'DeviceNotRegistered' } },
    ]);

    await service.processQueuedNotification({
      userIds: ['user-1'],
      payload: {
        type: 'group_invite',
        title: 'Invite',
        body: 'You were invited',
      },
    });

    expect(prisma.pushToken.deleteMany).toHaveBeenCalledWith({
      where: {
        token: {
          in: ['ExponentPushToken[invalidToken]'],
        },
      },
    });
  });

  it('retries Expo delivery with exponential backoff for transient failures', async () => {
    const { service, prisma } = createService();
    prisma.pushToken.findMany.mockResolvedValue([{ token: 'ExponentPushToken[retryToken]' }]);
    const sendPushNotificationsAsync = (service as any).expo.sendPushNotificationsAsync as jest.Mock;
    sendPushNotificationsAsync
      .mockRejectedValueOnce(new Error('transient failure'))
      .mockResolvedValueOnce([{ status: 'ok', id: 'ticket-1' }]);

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((callback: TimerHandler) => {
      if (typeof callback === 'function') {
        callback();
      }
      return 0 as unknown as ReturnType<typeof setTimeout>;
    });

    await service.processQueuedNotification({
      userIds: ['user-1'],
      payload: {
        type: 'settlement_created',
        title: 'Settlement',
        body: 'A settlement was recorded',
      },
    });

    expect(sendPushNotificationsAsync).toHaveBeenCalledTimes(2);
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);

    setTimeoutSpy.mockRestore();
  });
});
