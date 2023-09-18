import { UserType } from '@prisma/client';
import { Exclude, Type, Expose } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class BookBorrowDto {
  title: string;
}

class UserBorrowDto {
  username: string;
  user_type: UserType;
}

export class ResponseBorrowDto {
  constructor(partial: Partial<ResponseBorrowDto>) {
    Object.assign(this, partial);
  }
  expires: boolean;

  returned: boolean;

  date_of_borrow: Date;

  deadline: Date;

  user_id: string;

  book_id: string;

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

  @Exclude()
  id: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
