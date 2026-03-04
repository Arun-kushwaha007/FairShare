import { IsArray, IsIn, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpenseRequestDto, CreateExpenseSplitDto } from '@fairshare/shared-types';

export class CreateExpenseSplitInputDto implements CreateExpenseSplitDto {
  @IsString()
  userId!: string;

  @IsString()
  owedAmountCents!: string;

  @IsString()
  paidAmountCents!: string;
}

export class CreateExpenseDto implements CreateExpenseRequestDto {
  @IsString()
  payerId!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsString()
  totalAmountCents!: string;

  @IsString()
  @IsIn(['USD', 'EUR', 'INR'])
  currency!: 'USD' | 'EUR' | 'INR';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSplitInputDto)
  splits!: CreateExpenseSplitInputDto[];
}
