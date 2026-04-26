import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async ping(): Promise<string> {
    try {
      return await this.redis.ping();
    } catch (error) {
      this.logger.warn(`Redis ping unavailable: ${error instanceof Error ? error.message : 'unknown error'}`);
      return 'UNAVAILABLE';
    }
  }

  async getGroupBalanceCache(groupId: string): Promise<string | null> {
    return this.safeGet(`group:${groupId}:balances`);
  }

  async setGroupBalanceCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.safeSet(`group:${groupId}:balances`, payload, ttlSeconds);
  }

  async getGroupMembersCache(groupId: string): Promise<string | null> {
    return this.safeGet(`group:${groupId}:members`);
  }

  async setGroupMembersCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.safeSet(`group:${groupId}:members`, payload, ttlSeconds);
  }

  async getGroupExpenseSummaryCache(groupId: string): Promise<string | null> {
    return this.safeGet(`group:${groupId}:expense_summary`);
  }

  async setGroupExpenseSummaryCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.safeSet(`group:${groupId}:expense_summary`, payload, ttlSeconds);
  }

  async getGroupSummaryCache(groupId: string): Promise<string | null> {
    return this.safeGet(`group:${groupId}:summary`);
  }

  async setGroupSummaryCache(groupId: string, payload: string, ttlSeconds = 120): Promise<void> {
    await this.safeSet(`group:${groupId}:summary`, payload, ttlSeconds);
  }

  async invalidateGroupCache(groupId: string): Promise<void> {
    try {
      await this.redis.del(
        `group:${groupId}:balances`,
        `group:${groupId}:members`,
        `group:${groupId}:expense_summary`,
        `group:${groupId}:summary`,
      );
    } catch (error) {
      this.logger.warn(`Redis invalidate skipped: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async invalidateUserDashboardCache(userId: string): Promise<void> {
    try {
      await this.redis.del(`user:${userId}:dashboard`);
    } catch (error) {
      this.logger.warn(`Redis invalidate skipped: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async incrementFailedLogin(email: string): Promise<number> {
    try {
      const key = `login:fail:${email}`;
      const count = await this.redis.incr(key);
      if (count === 1) {
        await this.redis.expire(key, 15 * 60); // 15 minutes
      }
      return count;
    } catch (error) {
      this.logger.warn(`Redis incr skipped for login:fail:${email}`);
      return 0; // Fallback to allow if Redis is down
    }
  }

  async clearFailedLogin(email: string): Promise<void> {
    try {
      await this.redis.del(`login:fail:${email}`);
    } catch (error) {
      this.logger.warn(`Redis del skipped for login:fail:${email}`);
    }
  }

  async getFailedLoginCount(email: string): Promise<number> {
    try {
      const count = await this.redis.get(`login:fail:${email}`);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  async incrementInviteRateLimit(userId: string): Promise<number> {
    try {
      const key = `invite:rate:${userId}`;
      const count = await this.redis.incr(key);
      if (count === 1) {
        await this.redis.expire(key, 60 * 60); // 1 hour
      }
      return count;
    } catch (error) {
      this.logger.warn(`Redis incr skipped for invite:rate:${userId}`);
      return 0;
    }
  }

  private async safeGet(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      this.logger.warn(`Redis get skipped for ${key}: ${error instanceof Error ? error.message : 'unknown error'}`);
      return null;
    }
  }

  private async safeSet(key: string, payload: string, ttlSeconds: number): Promise<void> {
    try {
      await this.redis.set(key, payload, 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis set skipped for ${key}: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }
}
