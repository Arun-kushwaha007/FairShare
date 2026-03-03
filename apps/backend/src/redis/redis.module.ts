import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { AppConfigModule } from '../config/app-config.module';
import { AppConfigService } from '../config/app-config.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => new Redis(config.redisUrl),
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
