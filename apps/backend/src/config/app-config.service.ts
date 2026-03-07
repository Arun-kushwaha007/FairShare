import { Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  get port(): number {
    return Number(process.env.PORT ?? 3001);
  }

  get corsOrigins(): string[] {
    const origins = process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:8081';
    return origins.split(',').map((origin) => origin.trim());
  }

  get supabaseDatabaseUrl(): string {
    return this.mustGet('SUPABASE_DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.mustGet('JWT_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.mustGet('JWT_REFRESH_SECRET');
  }

  get googleClientId(): string {
    return this.mustGet('GOOGLE_CLIENT_ID');
  }

  get googleClientSecret(): string {
    return this.mustGet('GOOGLE_CLIENT_SECRET');
  }

  get redisUrl(): string {
    return this.mustGet('REDIS_URL');
  }

  get awsRegion(): string {
    return this.mustGet('AWS_REGION');
  }

  get s3Bucket(): string {
    return this.mustGet('S3_BUCKET');
  }

  get stripeSecretKey(): string {
    return this.mustGet('STRIPE_SECRET_KEY');
  }

  get stripeWebhookSecret(): string {
    return process.env.STRIPE_WEBHOOK_SECRET ?? '';
  }

  private mustGet(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}
