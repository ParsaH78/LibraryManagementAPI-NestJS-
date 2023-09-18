import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBorrowDto {
  @IsBoolean()
  @IsNotEmpty()
  expires: boolean;

  @IsBoolean()
  @IsNotEmpty()
  returned: boolean;

  @IsDate()
  @IsNotEmpty()
  date_of_borrow: Date;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  book_id: string;
}
