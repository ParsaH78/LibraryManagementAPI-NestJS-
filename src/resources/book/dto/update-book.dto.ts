import { PartialType } from '@nestjs/mapped-types';
import { AddGenreDto, CreateBookDto } from './create-book.dto';
export class UpdateBookDto extends PartialType(CreateBookDto) {}

export class UpdateGenreDto extends PartialType(AddGenreDto) {}
