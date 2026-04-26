import { Injectable } from '@nestjs/common';
import { AuthUserDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async me(userId: string): Promise<AuthUserDto> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  }

  async registerPushToken(userId: string, dto: RegisterPushTokenDto): Promise<{ success: true }> {
    await this.prisma.pushToken.upsert({
      where: { token: dto.token },
      update: {
        userId,
        deviceType: dto.deviceType,
      },
      create: {
        userId,
        token: dto.token,
        deviceType: dto.deviceType,
      },
    });

    return { success: true };
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }): Promise<AuthUserDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  }

  async deleteAccount(userId: string): Promise<{ success: true }> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Revoke refresh tokens
      await tx.refreshToken.deleteMany({ where: { userId } });
      
      // 2. Remove push tokens
      await tx.pushToken.deleteMany({ where: { userId } });
      
      // 3. Anonymize user info
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted-${userId}@fairshare.app`,
          name: 'Deleted User',
          passwordHash: '',
          avatarUrl: null,
        },
      });
    });

    return { success: true };
  }
}
