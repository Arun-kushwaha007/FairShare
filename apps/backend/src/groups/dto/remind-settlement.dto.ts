import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';
import { RemindSettlementRequestDto } from '@fairshare/shared-types';

export class RemindSettlementDto implements RemindSettlementRequestDto {
  @IsString()
  payerId!: string;

  @IsString()
  receiverId!: string;

  @Transform(({ value }: { value: string }) => value?.trim())
  @IsString()
  @Matches(/^\d+$/)
  amountCents!: string;
}
