import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { CurrencyCode } from '@fairshare/shared-types';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  groupId!: string;

  @IsString()
  @IsNotEmpty()
  payerId!: string;

  @IsString()
  @IsNotEmpty()
  receiverId!: string;

  @IsString()
  @MinLength(1)
  amountCents!: string;

  @IsString()
  @IsIn(['USD', 'EUR', 'INR'])
  currency!: CurrencyCode;
}
