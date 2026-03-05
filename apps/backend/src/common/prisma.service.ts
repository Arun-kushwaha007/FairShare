import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    const dbUrl = process.env.SUPABASE_DATABASE_URL;
    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        this.logger.log(`Connecting to PostgreSQL host=${parsed.host} db=${parsed.pathname.replace('/', '')}`);
      } catch {
        this.logger.warn('SUPABASE_DATABASE_URL is set but could not be parsed');
      }
    } else {
      this.logger.warn('SUPABASE_DATABASE_URL is not set');
    }

    await this.$connect();
    this.logger.log('Prisma database connection established');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma database connection closed');
  }
}
