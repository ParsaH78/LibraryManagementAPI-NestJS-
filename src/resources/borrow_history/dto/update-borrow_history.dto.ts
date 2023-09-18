import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowHistoryDto } from './create-borrow_history.dto';

export class UpdateBorrowHistoryDto extends PartialType(CreateBorrowHistoryDto) {}
