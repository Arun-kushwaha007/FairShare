import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async getGroupBalanceCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:balances`);
  }

  async setGroupBalanceCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.redis.set(`group:${groupId}:balances`, payload, 'EX', ttlSeconds);
  }

  async getGroupMembersCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:members`);
  }

  async setGroupMembersCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.redis.set(`group:${groupId}:members`, payload, 'EX', ttlSeconds);
  }

  async getGroupExpenseSummaryCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:expense_summary`);
  }

  async setGroupExpenseSummaryCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.redis.set(`group:${groupId}:expense_summary`, payload, 'EX', ttlSeconds);
  }

  async getGroupSummaryCache(groupId: string): Promise<string | null> {
    return this.redis.get(`group:${groupId}:summary`);
  }

  async setGroupSummaryCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.redis.set(`group:${groupId}:summary`, payload, 'EX', ttlSeconds);
  }

  async invalidateGroupCache(groupId: string): Promise<void> {
    await this.redis.del(
      `group:${groupId}:balances`,
      `group:${groupId}:members`,
      `group:${groupId}:expense_summary`,
      `group:${groupId}:summary`,
    );
  }
}
