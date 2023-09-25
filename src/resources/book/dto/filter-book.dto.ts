import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsArray,
  Min,
} from 'class-validator';

export class FilterBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  min_pages?: number;

  @IsNumber()
  @IsOptional()
  max_pages?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  min_published_at?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  max_published_at?: Date;

  @IsString()
  @IsOptional()
  author_name?: string;

  @IsNumber()
  @IsOptional()
  min_total_score?: number;

  @IsNumber()
  @IsOptional()
  max_total_score?: number;

  @IsString()
  @IsOptional()
  cover_pic?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}
