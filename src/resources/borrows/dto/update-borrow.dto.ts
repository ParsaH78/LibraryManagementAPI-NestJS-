import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBorrowDto } from './create-borrow.dto';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateBorrowDto extends PartialType(
  OmitType(CreateBorrowDto, ['book_id' as const]),
) {
  @IsOptional()
  @IsDate()
  date_of_return?: Date;

  @IsBoolean()
  @IsOptional()
  returned?: boolean;

  @IsBoolean()
  @IsOptional()
  expires?: boolean;
}
