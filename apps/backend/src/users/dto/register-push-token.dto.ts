import { IsIn, IsString } from 'class-validator';
import { RegisterPushTokenRequestDto } from '@fairshare/shared-types';

export class RegisterPushTokenDto implements RegisterPushTokenRequestDto {
  @IsString()
  token!: string;

  @IsString()
  @IsIn(['ios', 'android', 'web'])
  deviceType!: 'ios' | 'android' | 'web';
}
