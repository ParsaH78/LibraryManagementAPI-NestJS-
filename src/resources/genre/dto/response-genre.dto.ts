import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ResponseGenreDto {
  constructor(partial: Partial<ResponseGenreDto>) {
    Object.assign(this, partial);
  }

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  genre: string;
}
