import { IsArray, IsIn, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  CreateExpenseRequestDto,
  CreateExpenseSplitDto,
  EXPENSE_CATEGORIES,
  RECURRING_EXPENSE_FREQUENCIES,
  RecurringExpenseConfigDto,
} from '@fairshare/shared-types';
import { sanitizeText } from '../../common/utils/sanitize.util';

export class CreateExpenseSplitInputDto implements CreateExpenseSplitDto {
  @IsString()
  userId!: string;

  @IsString()
  owedAmountCents!: string;

  @IsString()
  paidAmountCents!: string;
}

export class RecurringExpenseConfigInputDto implements RecurringExpenseConfigDto {
  @IsString()
  @IsIn([...RECURRING_EXPENSE_FREQUENCIES])
  frequency!: (typeof RECURRING_EXPENSE_FREQUENCIES)[number];
}

export class CreateExpenseDto implements CreateExpenseRequestDto {
  @IsString()
  payerId!: string;

  @IsString()
  @MinLength(2)
  @Transform(({ value }: { value: unknown }) => sanitizeText(value))
  description!: string;

  @IsString()
  totalAmountCents!: string;

  @IsString()
  @IsIn(['USD', 'EUR', 'INR'])
  currency!: 'USD' | 'EUR' | 'INR';

  @IsOptional()
  @IsString()
  @IsIn([...EXPENSE_CATEGORIES])
  category?: (typeof EXPENSE_CATEGORIES)[number];

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurringExpenseConfigInputDto)
  recurring?: RecurringExpenseConfigInputDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseSplitInputDto)
  splits!: CreateExpenseSplitInputDto[];
}
