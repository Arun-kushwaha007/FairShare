import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { SettlementsModule } from '../settlements/settlements.module';
import { JobsModule } from '../jobs/jobs.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AppConfigModule, SettlementsModule, forwardRef(() => JobsModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
