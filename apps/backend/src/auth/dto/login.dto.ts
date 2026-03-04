import { IsEmail, IsString, MinLength } from 'class-validator';
import { LoginRequestDto } from '@fairshare/shared-types';

export class LoginDto implements LoginRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
