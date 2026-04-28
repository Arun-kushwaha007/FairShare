import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { AppConfigService } from '../config/app-config.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly config: AppConfigService,
  ) {}

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request & { csrfToken?: () => string }) {
    return {
      csrfToken: req.csrfToken ? req.csrfToken() : '',
    };
  }

  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    this.logger.log(`POST /auth/register email=${dto.email.toLowerCase()}`);
    const payload = await this.authService.register(dto);
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    return payload;
  }

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
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

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request & { user: any }, @Res() res: Response) {
    this.logger.log(`GET /auth/google/callback email=${req.user.email}`);
    const payload = await this.authService.googleLogin({
      email: req.user.email,
      name: req.user.name,
      avatarUrl: req.user.avatarUrl,
    });
    this.authService.setRefreshTokenCookie(res, payload.refreshToken);
    
    // Redirect back to frontend dashboard
    const frontendUrl = this.config.corsOrigins[0]; // Usually the web frontend is first
    res.redirect(`${frontendUrl}/dashboard`);
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
