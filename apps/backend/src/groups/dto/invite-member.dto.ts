import { IsEmail } from 'class-validator';
import { InviteMemberRequestDto } from '@fairshare/shared-types';

export class InviteMemberDto implements InviteMemberRequestDto {
  @IsEmail()
  email!: string;
}
