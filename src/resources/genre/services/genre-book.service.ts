import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseGenreDto } from '../dto/response-genre.dto';
import { BookService } from '../../book/book.service';
import { ResponseBookDto } from '../../book/dto/response-book.dto';
import { GenreService } from './genre.service';
@Injectable()
export class GenreBookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BookService,
    private readonly genreService: GenreService,
  ) {}

  async addGenreToBook(
    genre_id: string,
    book_id: string,
  ): Promise<ResponseBookDto> {
    const isBook: ResponseBookDto = await this.bookService.findOne(book_id);
    if (!isBook) {
      throw new NotFoundException('Book has not been found !');
    }

    const isGenre: ResponseGenreDto = await this.genreService.findOne(genre_id);
    if (!isGenre) {
      throw new NotFoundException('Genre has not been found !');
    }

    const updated_book: ResponseBookDto = await this.bookService.update(
      book_id,
      {
        genre: isGenre.genre,
      },
    );

    return updated_book;
  }
}
