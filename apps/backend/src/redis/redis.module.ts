import { Global, Logger, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { RedisService } from './redis.service';

const MAX_REDIS_RETRIES = 3;
const RETRY_DELAY_MS = 250;
const MAX_RETRY_DELAY_MS = 1000;

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        const logger = new Logger('RedisClient');
        const client = new Redis(config.redisUrl, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          enableOfflineQueue: true,
          connectionName: 'fairshare:cache',
          retryStrategy: (times) => {
            if (times > MAX_REDIS_RETRIES) {
              logger.warn('cache Redis reconnect attempts exhausted');
              return null;
            }

            return Math.min(times * RETRY_DELAY_MS, MAX_RETRY_DELAY_MS);
          },
        });

        client.on('error', (error) => {
          logger.warn(`cache Redis error: ${error.message}`);
        });
        client.on('end', () => {
          logger.warn('cache Redis connection closed');
        });

        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
