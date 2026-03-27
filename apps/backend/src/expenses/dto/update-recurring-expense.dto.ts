import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { EXPENSE_CATEGORIES, RECURRING_EXPENSE_FREQUENCIES, UpdateRecurringExpenseRequestDto } from '@fairshare/shared-types';

export class UpdateRecurringExpenseDto implements UpdateRecurringExpenseRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsString()
  totalAmountCents?: string;

  @IsOptional()
  @IsString()
  @IsIn([...EXPENSE_CATEGORIES])
  category?: (typeof EXPENSE_CATEGORIES)[number] | null;

  @IsOptional()
  @IsString()
  @IsIn([...RECURRING_EXPENSE_FREQUENCIES])
  frequency?: (typeof RECURRING_EXPENSE_FREQUENCIES)[number];
}
