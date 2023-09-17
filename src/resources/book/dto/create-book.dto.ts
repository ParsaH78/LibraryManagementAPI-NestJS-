import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  pages: number;
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  published_at: Date;
  @IsString()
  @IsNotEmpty()
  author_name: string;
  @IsNumber()
  @IsOptional()
  total_score?: number;
  @IsString()
  @IsOptional()
  cover_pic?: string;
  @IsString()
  @IsOptional()
  genre?: string;
}

export class AddGenreDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  genre_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  book_id: string;
}
