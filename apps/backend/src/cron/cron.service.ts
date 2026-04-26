import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async purgeExpiredRefreshTokens() {
    this.logger.log('Running nightly cron job: purgeExpiredRefreshTokens');
    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { revokedAt: { not: null } },
          ],
        },
      });
      this.logger.log(`Purged ${result.count} expired/revoked refresh tokens.`);
    } catch (error) {
      this.logger.error('Failed to purge refresh tokens', error instanceof Error ? error.stack : undefined);
    }
  }
}
