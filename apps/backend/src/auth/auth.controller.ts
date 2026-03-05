import { Body, Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`POST /auth/register email=${dto.email.toLowerCase()}`);
    const payload = await this.authService.register(dto);
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    return payload;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`POST /auth/login email=${dto.email.toLowerCase()}`);
    const payload = await this.authService.login(dto);
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    return payload;
  }

  @Post('google')
  async google(@Body() dto: GoogleLoginDto, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`POST /auth/google email=${dto.email.toLowerCase()}`);
    const payload = await this.authService.googleLogin(dto);
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    return payload;
  }

  @Post('refresh')
  async refresh(@Req() req: Request & { cookies?: Record<string, string> }, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refresh_token;
    if (!token) {
      this.logger.warn('POST /auth/refresh missing refresh_token cookie');
      return { message: 'Missing refresh token' };
    }

    this.logger.log('POST /auth/refresh with cookie');
    const payload = await this.authService.refresh(token);
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    return payload;
  }
}
