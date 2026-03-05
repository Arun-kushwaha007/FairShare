import { Logger } from '@nestjs/common';

const logger = new Logger('StructuredLogger');

export function logStructured(payload: Record<string, unknown>): void {
  logger.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      ...payload,
    }),
  );
}
