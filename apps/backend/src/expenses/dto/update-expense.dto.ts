import { IsOptional, IsString, MinLength } from 'class-validator';
import { UpdateExpenseRequestDto } from '@fairshare/shared-types';

export class UpdateExpenseDto implements UpdateExpenseRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;
}
