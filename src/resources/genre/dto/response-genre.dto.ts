export class ResponseGenreDto {
  constructor(partial: Partial<ResponseGenreDto>) {
    Object.assign(this, partial);
  }

  id: string;

  genre: string;
}
