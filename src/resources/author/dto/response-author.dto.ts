export class ResponseAuthorDto {
  constructor(partial: Partial<ResponseAuthorDto>) {
    Object.assign(this, partial);
  }

  id: string;

  name: string;
}
