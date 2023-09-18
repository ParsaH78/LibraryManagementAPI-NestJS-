import { UserType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class BookScoreDto {
  title: string;
}

class UserScoreDto {
  username: string;
  user_type: UserType;
}

export class ResponseScoreDto {
  constructor(partial: Partial<ResponseScoreDto>) {
    Object.assign(this, partial);
  }

  score: number;

  book_id: string;

  user_id: string;

  @Exclude()
  @ValidateNested()
  @Type(() => BookScoreDto)
  book: BookScoreDto;

  @Expose({ name: 'bookTitle' })
  bookTitle() {
    return this.book.title;
  }

  @Exclude()
  @ValidateNested()
  @Type(() => UserScoreDto)
  user: UserScoreDto;

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
