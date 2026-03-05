import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap(): Promise<void> {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    tracesSampleRate: 0.2,
  });

  process.on('unhandledRejection', (reason) => {
    Sentry.captureException(reason);
  });

  process.on('uncaughtException', (error) => {
    Sentry.captureException(error);
  });

  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfigService);

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
  });

  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
