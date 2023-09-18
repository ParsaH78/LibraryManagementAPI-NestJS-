import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBorrowDto } from './create-borrow.dto';

export class UpdateBorrowDto extends PartialType(
  OmitType(CreateBorrowDto, ['book_id' as const]),
) {}
