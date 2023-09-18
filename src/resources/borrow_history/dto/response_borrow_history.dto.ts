import { UserType } from '@prisma/client';
import { CreateBorrowHistoryDto } from './create-borrow_history.dto';
import { Exclude, Type, Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class BookBorrowDto {
  title: string;
}

class UserBorrowDto {
  username: string;
  user_type: UserType;
}

class BorrowDetailDto {
  expires: boolean;

  returned: boolean;

  date_of_borrow: Date;

  deadline: Date;
}

export class ResponseBorrowHistoryDto {
  constructor(partial: Partial<CreateBorrowHistoryDto>) {
    Object.assign(this, partial);
  }
  id: string;

  user_id: string;

  book_id: string;

  borrow_id: string;

  created_at: Date;

  updated_at: Date;

  @Exclude()
  @ValidateNested()
  @Type(() => BorrowDetailDto)
  borrow_detail: BorrowDetailDto;

  @Expose({ name: 'expires' })
  expires() {
    return this.borrow_detail.expires;
  }

  @Expose({ name: 'returned' })
  returned() {
    return this.borrow_detail.returned;
  }

  @Expose({ name: 'dateOfBorrow' })
  dateOfBorrow() {
    return this.borrow_detail.date_of_borrow;
  }

  @Expose({ name: 'deadline' })
  deadline() {
    return this.borrow_detail.deadline;
  }

  @Exclude()
  @ValidateNested()
  @Type(() => BookBorrowDto)
  book: BookBorrowDto;

  @Expose({ name: 'bookTitle' })
  bookTitle() {
    return this.book.title;
  }

  @Exclude()
  @ValidateNested()
  @Type(() => UserBorrowDto)
  user: UserBorrowDto;

  @Expose({ name: 'username' })
  username() {
    return this.user.username;
  }

  @Expose({ name: 'userType' })
  userType() {
    return this.user.user_type;
  }
}
