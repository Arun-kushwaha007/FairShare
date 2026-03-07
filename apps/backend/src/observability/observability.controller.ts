import { Controller, Get, Header } from '@nestjs/common';
import { getMetrics } from './metrics';

@Controller('metrics')
export class ObservabilityController {
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  async metrics(): Promise<string> {
    return getMetrics();
  }
}
