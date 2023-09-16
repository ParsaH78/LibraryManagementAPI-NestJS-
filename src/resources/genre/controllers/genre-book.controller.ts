import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenreBookService } from '../services/genre-book.service';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('genre/book')
export class GenreController {
  constructor(private readonly genreBookService: GenreBookService) {}

  @Roles('ADMIN')
  @Post()
  addGenreToBook(genre_id: string, book_id: string) {
    return this.genreBookService.addGenreToBook(genre_id, book_id);
  }
}
