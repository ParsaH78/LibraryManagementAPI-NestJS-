import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBorrowDto {
  @IsDate()
  @IsOptional()
  date_of_borrow?: Date;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  book_id: string;
}
