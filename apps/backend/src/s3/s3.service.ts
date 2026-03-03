import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(private readonly config: AppConfigService) {
    this.s3 = new AWS.S3({ region: this.config.awsRegion });
  }

  async getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 300): Promise<string> {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.config.s3Bucket,
      Key: key,
      ContentType: contentType,
      Expires: expiresInSeconds,
    });
  }
}
