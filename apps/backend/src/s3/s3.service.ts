import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly config: AppConfigService) {
    this.s3 = new S3Client({ region: this.config.awsRegion });
  }

  async getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 300): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.config.s3Bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3, command, { expiresIn: expiresInSeconds });
  }
}
