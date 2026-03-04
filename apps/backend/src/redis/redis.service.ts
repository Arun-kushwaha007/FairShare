import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getGroupBalanceCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:balances`);
  }

  async setGroupBalanceCache(groupId: string, payload: string, ttlSeconds = 60): Promise<void> {
    await this.redis.set(`group:${groupId}:balances`, payload, 'EX', ttlSeconds);
  }

  async getGroupMembersCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:members`);
  }

  async setGroupMembersCache(groupId: string, payload: string, ttlSeconds = 60): Promise<void> {
    await this.redis.set(`group:${groupId}:members`, payload, 'EX', ttlSeconds);
  }

  async invalidateGroupCache(groupId: string): Promise<void> {
    await this.redis.del(`group:${groupId}:balances`, `group:${groupId}:members`);
  }
}
