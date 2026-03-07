import { Transform } from 'class-transformer';
import { IsIn, IsString, MinLength } from 'class-validator';
import { CreateGroupRequestDto } from '@fairshare/shared-types';
import { sanitizeText } from '../../common/utils/sanitize.util';

export class CreateGroupDto implements CreateGroupRequestDto {
  @IsString()
  @MinLength(2)
  @Transform(({ value }: { value: unknown }) => sanitizeText(value))
  name!: string;

  @IsString()
  @IsIn(['USD', 'EUR', 'INR'])
  currency!: 'USD' | 'EUR' | 'INR';
}
