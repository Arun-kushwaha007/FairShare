import { IsIn, IsString, MinLength } from 'class-validator';
import { CreateGroupRequestDto } from '@fairshare/shared-types';

export class CreateGroupDto implements CreateGroupRequestDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsIn(['USD', 'EUR', 'INR'])
  currency!: 'USD' | 'EUR' | 'INR';
}
