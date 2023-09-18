import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateScoreDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  score: number;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  book_id: string;
}
