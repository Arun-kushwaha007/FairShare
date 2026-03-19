import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { EXPENSE_CATEGORIES, UpdateExpenseRequestDto } from '@fairshare/shared-types';

export class UpdateExpenseDto implements UpdateExpenseRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn([...EXPENSE_CATEGORIES])
  category?: (typeof EXPENSE_CATEGORIES)[number] | null;
}
