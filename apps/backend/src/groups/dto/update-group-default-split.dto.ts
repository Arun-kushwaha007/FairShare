import { Type } from 'class-transformer';
import { IsArray, IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EXPENSE_SPLIT_TYPES, GroupDefaultSplitDto, UpdateGroupDefaultSplitRequestDto } from '@fairshare/shared-types';

class GroupDefaultSplitPreferenceDto implements GroupDefaultSplitDto {
  @IsString()
  @IsIn([...EXPENSE_SPLIT_TYPES])
  splitType!: (typeof EXPENSE_SPLIT_TYPES)[number];

  @IsArray()
  @IsString({ each: true })
  participantUserIds!: string[];

  @IsOptional()
  @IsObject()
  exactAmountsCentsByUser?: Record<string, string>;

  @IsOptional()
  @IsObject()
  percentagesByUser?: Record<string, string>;
}

export class UpdateGroupDefaultSplitDto implements UpdateGroupDefaultSplitRequestDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => GroupDefaultSplitPreferenceDto)
  defaultSplitPreference!: GroupDefaultSplitPreferenceDto | null;
}
