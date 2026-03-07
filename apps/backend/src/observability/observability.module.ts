import { Module } from '@nestjs/common';
import { ObservabilityController } from './observability.controller';

@Module({
  controllers: [ObservabilityController],
})
export class ObservabilityModule {}
