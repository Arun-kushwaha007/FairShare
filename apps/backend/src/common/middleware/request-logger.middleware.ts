import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - start;
      this.logger.log(
        `${req.method} ${req.originalUrl} status=${res.statusCode} durationMs=${durationMs}`,
      );
    });

    next();
  }
}
