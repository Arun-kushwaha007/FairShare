import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/auth.types';
import { UsersService } from './users.service';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.me(user.sub);
  }

  @Post('push-token')
  registerPushToken(@CurrentUser() user: JwtPayload, @Body() dto: RegisterPushTokenDto) {
    return this.usersService.registerPushToken(user.sub, dto);
  }
}
