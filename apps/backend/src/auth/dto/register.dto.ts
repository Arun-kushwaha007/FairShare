import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { RegisterRequestDto } from '@fairshare/shared-types';

export class RegisterDto implements RegisterRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'password must contain at least one number' })
  password!: string;

  @IsString()
  @MinLength(2)
  name!: string;
}
