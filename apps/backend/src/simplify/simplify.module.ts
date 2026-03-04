import { Module } from '@nestjs/common';
import { SimplifyController } from './simplify.controller';
import { SimplifyService } from './simplify.service';

@Module({
  controllers: [SimplifyController],
  providers: [SimplifyService],
  exports: [SimplifyService],
})
export class SimplifyModule {}
