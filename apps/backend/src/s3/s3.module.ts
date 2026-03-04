import { Global, Module } from '@nestjs/common';
import { AppConfigModule } from '../config/app-config.module';
import { S3Service } from './s3.service';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
