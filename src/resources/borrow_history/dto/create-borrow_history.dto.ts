import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBorrowHistoryDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  book_id: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  borrow_id: string;
}
