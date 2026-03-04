import { IsEmail, IsOptional, IsString } from 'class-validator';
import { GoogleLoginRequestDto } from '@fairshare/shared-types';

export class GoogleLoginDto implements GoogleLoginRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
