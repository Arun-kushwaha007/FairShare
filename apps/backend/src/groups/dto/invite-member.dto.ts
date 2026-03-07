import { Transform } from 'class-transformer';
import { IsEmail, Matches, MaxLength } from 'class-validator';
import { InviteMemberRequestDto } from '@fairshare/shared-types';

export class InviteMemberDto implements InviteMemberRequestDto {
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  @MaxLength(254)
  @Matches(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
  email!: string;
}
