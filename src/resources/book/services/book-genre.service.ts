import {
  Injectable,
  NotFoundException,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseGenreDto } from '../../genre/dto/response-genre.dto';
import { BookService } from './book.service';
import { GenreDto, ResponseBookDto } from '../dto/response-book.dto';
import { GenreService } from '../../genre/genre.service';
@Injectable()
export class BookGenreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BookService,
    private readonly genreService: GenreService,
  ) {}

  async addGenreToBook(
    genre_id: string,
    book_id: string,
  ): Promise<ResponseBookDto | HttpException> {
    const { isBook, isGenre, error } = await this.isGenreBookValid(
      genre_id,
      book_id,
    );

    if (error) {
      return error;
    }

    if (isBook.genres.find((g) => g.genre === isGenre.genre)) {
      throw new ConflictException('This Genre has already been included');
    }

    const updated_book = await this.prismaService.book.update({
      where: {
        id: book_id,
      },
      data: {
        genres: {
          set: [...isBook.genres, isGenre],
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        genres: {
          select: {
            genre: true,
          },
        },
      },
    });

    return new ResponseBookDto(updated_book);
  }

  async getAllGenresFromBook(
    book_id: string,
  ): Promise<HttpException | GenreDto[]> {
    const isBook: ResponseBookDto = await this.bookService.findOne(book_id);

    if (!isBook) {
      throw new NotFoundException('There is no book with this ID');
    }

    return isBook.genres;
  }

  async removeGenreFromBook(
    genre_id: string,
    book_id: string,
  ): Promise<HttpException | string> {
    const { isBook, isGenre, error } = await this.isGenreBookValid(
      genre_id,
      book_id,
    );

    if (error) {
      throw error;
    }

    if (!isBook.genres.find((g) => g.genre === isGenre.genre)) {
      throw new NotFoundException('This Book is not in this Genre');
    }

    await this.prismaService.book.update({
      where: {
        id: book_id,
      },
      data: {
        genres: {
          set: isBook.genres.filter((g) => g.genre !== isGenre.genre),
        },
      },
    });

    return `${isGenre.genre} has been removed from ${isBook.title} ! `;
  }

  async isGenreBookValid(genre_id: string, book_id: string) {
    let error: HttpException = null;

    const isBook: ResponseBookDto = await this.bookService.findOne(book_id);
    if (!isBook) {
      error = new NotFoundException('Book has not been found !');
    }

    const isGenre: ResponseGenreDto = await this.genreService.findOne(genre_id);
    if (!isGenre) {
      error = new NotFoundException('Genre has not been found !');
    }

    return { isBook, isGenre, error };
  }
}
