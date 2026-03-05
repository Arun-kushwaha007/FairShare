import { IsEmail, Matches } from 'class-validator';
import { InviteMemberRequestDto } from '@fairshare/shared-types';

export class InviteMemberDto implements InviteMemberRequestDto {
  @IsEmail()
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
  email!: string;
}