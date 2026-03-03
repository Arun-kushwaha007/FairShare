import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const payload = await this.authService.login(dto);
    this.authService.setRefreshCookie(res, payload.refreshToken);
    return {
      accessToken: payload.accessToken,
      user: payload.user,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request & { cookies?: Record<string, string> }, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    const payload = await this.authService.refresh(refreshToken);
    this.authService.setRefreshCookie(res, payload.refreshToken);
    return {
      accessToken: payload.accessToken,
      user: payload.user,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request & { cookies?: Record<string, string> }, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    await this.authService.logout(refreshToken);
    this.authService.clearRefreshCookie(res);
    return { success: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(
    @Req() req: { user: { accessToken: string; refreshToken: string; user: unknown } },
    @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.setRefreshCookie(res, req.user.refreshToken);
    return {
      accessToken: req.user.accessToken,
      user: req.user.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: unknown }) {
    return req.user;
  }
}
