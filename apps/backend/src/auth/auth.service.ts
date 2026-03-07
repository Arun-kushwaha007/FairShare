import { ConflictException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { AuthTokensDto } from '@fairshare/shared-types';
import { PrismaService } from '../common/prisma.service';
import { AppConfigService } from '../config/app-config.service';
import { JwtPayload } from './types/auth.types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { setActiveUsers } from '../observability/metrics';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensDto> {
    const email = dto.email.toLowerCase();
    this.logger.log(`Register attempt email=${email}`);

    try {
      const passwordHash = await hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          name: dto.name,
        },
      });

      this.logger.log(`Register success userId=${user.id} email=${email}`);
      return this.issueTokens(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.warn(`Register duplicate email=${email}`);
        throw new ConflictException('Email already registered');
      }

      this.logger.error(`Register failed email=${email}`, error instanceof Error ? error.stack : undefined);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const email = dto.email.toLowerCase();
    this.logger.log(`Login attempt email=${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`Login failed user-not-found email=${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) {
      this.logger.warn(`Login failed invalid-password userId=${user.id}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Login success userId=${user.id} email=${email}`);
    return this.issueTokens(user.id, user.email);
  }

  async googleLogin(dto: GoogleLoginDto): Promise<AuthTokensDto> {
    const email = dto.email.toLowerCase();
    this.logger.log(`Google login attempt email=${email}`);

    const user =
      (await this.prisma.user.findUnique({ where: { email } })) ??
      (await this.prisma.user.create({
        data: {
          email,
          name: dto.name,
          avatarUrl: dto.avatarUrl,
          passwordHash: await hash(randomUUID(), 10),
        },
      }));

    this.logger.log(`Google login success userId=${user.id} email=${email}`);
    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.config.jwtRefreshSecret,
    });

    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
      },
    });

    const matched = await Promise.any(
      tokens.map(async (token) =>
        (await compare(refreshToken, token.tokenHash)) ? token : Promise.reject(new Error('No match')),
      ),
    ).catch(() => null);

    if (!matched) {
      this.logger.warn(`Refresh failed userId=${payload.sub}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: matched.id },
      data: { revokedAt: new Date() },
    });

    this.logger.log(`Refresh success userId=${payload.sub}`);
    return this.issueTokens(payload.sub, payload.email);
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private async issueTokens(userId: string, email: string): Promise<AuthTokensDto> {
    const payload: JwtPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtSecret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtRefreshSecret,
        expiresIn: '7d',
      }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: await hash(refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const active = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      distinct: ['userId'],
      select: { userId: true },
    });
    setActiveUsers(active.length);

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
