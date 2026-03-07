import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { logStructured } from '../logger/structured-logger.util';
import { observeApiRequest } from '../../observability/metrics';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const requestId = req.header('x-request-id') ?? randomUUID();
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const durationMs = Date.now() - start;
      this.logger.log(
        `${req.method} ${req.originalUrl} status=${res.statusCode} durationMs=${durationMs}`,
      );
      observeApiRequest(req.method, req.path, res.statusCode, durationMs);
      logStructured({
        requestId,
        route: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        userId: (req as Request & { user?: { sub?: string } }).user?.sub ?? null,
        duration: durationMs,
      });
    });

    next();
  }
}
