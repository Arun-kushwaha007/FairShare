import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly config: AppConfigService) {
    this.s3 = new S3Client({ region: this.config.awsRegion });
  }

  async getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds = 300): Promise<{ url: string; fields: Record<string, string> }> {
    const { url, fields } = await createPresignedPost(this.s3, {
      Bucket: this.config.s3Bucket,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['eq', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: expiresInSeconds,
    });

    return { url, fields };
  }
}
