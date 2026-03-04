import { IsString } from 'class-validator';
import { CreateSettlementRequestDto } from '@fairshare/shared-types';

export class CreateSettlementDto implements CreateSettlementRequestDto {
  @IsString()
  payerId!: string;

  @IsString()
  receiverId!: string;

  @IsString()
  amountCents!: string;
}
