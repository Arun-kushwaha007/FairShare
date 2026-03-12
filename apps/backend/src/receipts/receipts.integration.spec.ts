import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AddressInfo } from 'net';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../common/prisma.service';
import { S3Service } from '../s3/s3.service';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';

class AllowAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}

describe('Receipt URL endpoint (integration-ish)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReceiptsController],
      providers: [
        ReceiptsService,
        {
          provide: PrismaService,
          useValue: {
            expense: {
              findUnique: jest.fn().mockResolvedValue({ id: 'expense-1', groupId: 'group-1' }),
            },
            receipt: {
              upsert: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
        {
          provide: S3Service,
          useValue: {
            getPresignedUploadUrl: jest.fn().mockResolvedValue('https://signed.example/upload'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new AllowAuthGuard())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0, '127.0.0.1');
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns a presigned upload URL from the HTTP endpoint', async () => {
    const address = app.getHttpServer().address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/expenses/expense-1/receipt-url`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ extension: 'jpg' }),
    });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      uploadUrl: 'https://signed.example/upload',
      fileKey: expect.stringMatching(/^receipts\/group-1\/expense-1\/.+\.jpg$/),
    });
  });
});
