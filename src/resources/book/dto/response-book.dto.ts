import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class AuthorDto {
  name: string;
}

export class GenreDto {
  id: string;
  genre: string;
}

export class ResponseBookDto {
  constructor(partial: Partial<ResponseBookDto>) {
    Object.assign(this, partial);
  }

  title: string;

  description: string;

  pages: number;

  published_at: Date;

  @Exclude()
  @ValidateNested()
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @Expose({ name: 'authorName' })
  authorName() {
    return this.author.name;
  }

  @Exclude()
  @ValidateNested()
  @Type(() => GenreDto)
  genres?: GenreDto[];

  @Expose({ name: 'genreNames' })
  genreName() {
    return this.genres.map((g) => {
      return g.genre;
    });
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
}
