import { IsOptional, IsString } from 'class-validator';

export class CreateReceiptUrlDto {
  @IsOptional()
  @IsString()
  extension?: string;
}
