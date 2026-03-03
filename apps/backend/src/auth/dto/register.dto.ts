import { IsEmail, IsString, MinLength } from 'class-validator';
import { RegisterRequestDto } from '@fairshare/shared-types';

export class RegisterDto implements RegisterRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
