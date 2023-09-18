import {
  Body,
  Controller,
  Patch,
  ParseUUIDPipe,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { BookGenreService } from '../services/book-genre.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AddGenreDto } from '../dto/create-book.dto';

@Roles('ADMIN')
@Controller('/addgenre')
export class BookGenreController {
  constructor(private readonly bookGenreService: BookGenreService) {}

  @Patch()
  addGenreToBook(@Body() body: AddGenreDto) {
    return this.bookGenreService.addGenreToBook(body.genre_id, body.book_id);
  }

  @Get('/:id')
  getAllGenresFromBook(@Param('id', ParseUUIDPipe) book_id: string) {
    return this.bookGenreService.getAllGenresFromBook(book_id);
  }

  @Delete('/:id')
  removeGenreFromBook(
    @Param('id', ParseUUIDPipe) book_id: string,
    @Body('id', ParseUUIDPipe) genre_id: string,
  ) {
    return this.bookGenreService.removeGenreFromBook(genre_id, book_id);
  }
}
