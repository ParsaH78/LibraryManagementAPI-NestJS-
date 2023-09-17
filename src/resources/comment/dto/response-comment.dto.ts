import { UserType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class BookCommentDto {
  title: string;
}

class UserCommentDto {
  username: string;
  user_type: UserType;
}

export class ResponseCommentDto {
  constructor(partial: Partial<ResponseCommentDto>) {
    Object.assign(this, partial);
  }
  comment: string;

  user_id: string;

  book_id: string;

  @Exclude()
  @ValidateNested()
  @Type(() => BookCommentDto)
  book: BookCommentDto;

  @Expose({ name: 'bookTitle' })
  bookTitle() {
    return this.book.title;
  }

  @Exclude()
  @ValidateNested()
  @Type(() => UserCommentDto)
  user: UserCommentDto;

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
