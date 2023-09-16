import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class AuthorDto {
  @IsString()
  name: string;
}

export class ResponseBookDto {
  title: string;

  description: string;

  pages: number;

  published_at: Date;

  @Exclude()
  @ValidateNested()
  @Type(() => Image)
  author: AuthorDto;

  @Expose({ name: 'authorName' })
  authorName() {
    return this.author.name;
  }

  total_score: number;

  cover_pic: string;

  @Exclude()
  id: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  author_id: string;

  constructor(partial: Partial<ResponseBookDto>) {
    Object.assign(this, partial);
  }
}
