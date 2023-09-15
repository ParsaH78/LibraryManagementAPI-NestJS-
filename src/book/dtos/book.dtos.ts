import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Author {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class GenreDto {
  @IsString()
  @IsNotEmpty()
  genre: string;
}

class ImageDto {
  @IsString()
  @IsOptional()
  url: string;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  total_Score: number;

  @IsNumber()
  @IsNotEmpty()
  pages: number;

  @IsDate()
  @IsOptional()
  published_at: Date;

  @ValidateNested()
  author: Author;

  @ValidateNested()
  genres: GenreDto[];

  @ValidateNested()
  cover_pic: ImageDto;
}
