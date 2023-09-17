import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class ScoreDto {
  score: number;
}

class CommentDto {
  comment: string;
}

export class ResponseUserDto {
  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
  username: string;
  email: string;
  address: string;
  phone_number: string;

  @Exclude()
  @ValidateNested()
  @Type(() => ScoreDto)
  scores: ScoreDto[];

  @Expose({ name: 'scoreHistory' })
  scoreHistory() {
    return this.scores.map((s) => {
      return s.score;
    });
  }

  @Exclude()
  @ValidateNested()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose({ name: 'commentHistory' })
  commentHistory() {
    return this.comments.map((c) => {
      return c.comment;
    });
  }

  @Exclude()
  id: string;

  @Exclude()
  password: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  user_type: 'ADMIN' | 'MEMBER';
}
