import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export const RECEIPT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type ReceiptExtension = (typeof RECEIPT_EXTENSIONS)[number];

export class CreateReceiptUrlDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsIn(RECEIPT_EXTENSIONS)
  extension?: ReceiptExtension;
}
