/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorService } from '../author/author.service';
import { ResponseBookDto } from './dto/response-book.dto';
import { GenreService } from 'src/resources/genre/genre.service';
import { ResponseGenreDto } from 'src/resources/genre/dto/response-genre.dto';
import { ErrorInterface } from './interfaces/error.interface';
import { ResponseAuthorDto } from '../author/dto';
import { FilterBookDto } from './dto/filter-book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
  ) {}
  async create(
    createBookDto: CreateBookDto,
    genres_data: ResponseGenreDto[],
    author: ResponseAuthorDto,
  ) {
    createBookDto.title = createBookDto.title.toLowerCase();
    const { author_name, genres, ...data } = createBookDto;

    try {
      const book = await this.prismaService.book.create({
        data: {
          ...data,
          genres: {
            connect: genres_data,
          },
          author_id: author.id,
        },
      });

      return book;
    } catch (error) {
      throw new HttpException(
        `Error in creating book : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async searchBooks(filters: FilterBookDto): Promise<ResponseBookDto[]> {
    if (isNaN(filters.min_published_at.getTime()))
      filters.min_published_at = new Date('1000-01-01');

    if (isNaN(filters.max_published_at.getTime()))
      filters.max_published_at = new Date();

    try {
      const books = await this.prismaService.book.findMany({
        where: {
          AND: [
            { title: { contains: filters.title } },
            { description: { contains: filters.description } },
            {
              AND: [
                { pages: { gte: filters.min_pages } },
                { pages: { lte: filters.max_pages } },
              ],
            },
            {
              AND: [
                { published_at: { gte: filters.min_published_at } },
                { published_at: { lte: filters.max_published_at } },
              ],
            },
            {
              author: {
                name: { contains: filters.author_name },
              },
            },
            {
              AND: [
                { total_score: { gte: filters.min_total_score } },
                { total_score: { lte: filters.max_total_score } },
              ],
            },
            { cover_pic: { contains: filters.cover_pic } },
            {
              genres: {
                some: {
                  genre: {
                    in: filters.genres,
                  },
                },
              },
            },
          ],
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
              id: true,
            },
          },
        },
      });

      return books.map((book) => {
        return new ResponseBookDto(book);
      });
    } catch (error) {
      throw new HttpException(
        `Error in searching books : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseBookDto[]> {
    try {
      const books = await this.prismaService.book.findMany({
        include: {
          author: {
            select: {
              name: true,
            },
          },
          genres: {
            select: {
              genre: true,
              id: true,
            },
          },
        },
      });

      return books.map((book) => {
        return new ResponseBookDto(book);
      });
    } catch (error) {
      throw new HttpException(
        `Error in getting all books : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseBookDto> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          id,
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
              id: true,
            },
          },
        },
      });

      return new ResponseBookDto(book);
    } catch (error) {
      throw new HttpException(
        `Error in getting book by ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByName(title: string): Promise<ResponseBookDto> {
    try {
      const book = await this.prismaService.book.findUnique({
        where: {
          title,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          genres: {
            select: {
              id: true,
              genre: true,
            },
          },
        },
      });
      return new ResponseBookDto(book);
    } catch (error) {
      throw new HttpException(
        `Error in getting book by Title : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    genres_data: ResponseGenreDto[],
    new_author: ResponseAuthorDto,
  ) {
    if ('title' in updateBookDto)
      updateBookDto.title = updateBookDto.title.toLowerCase();

    const { author_name, genres, ...data } = updateBookDto;

    try {
      const updated_book = await this.prismaService.book.update({
        where: {
          id,
        },
        data: {
          ...data,
          genres: {
            set: genres_data,
          },
          author_id: new_author.id,
        },
      });

      return updated_book;
    } catch (error) {
      throw new HttpException(
        `Error in updating book : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const book = await this.prismaService.book.delete({
        where: { id },
      });
      return { message: `Book with name ${book.title} has been removed !` };
    } catch (error) {
      throw new HttpException(
        `Error in removing book : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async isAuthorValid(
    author_name: string,
  ): Promise<{ author: ResponseAuthorDto; error: ErrorInterface }> {
    let error: ErrorInterface = null;
    const author = await this.authorService.findOneByName(
      author_name.toLowerCase(),
    );

    if (!author) {
      error = { message: 'There is no author with this name', code: 404 };
    }

    return { author, error };
  }

  async genreValidation(genre: string): Promise<{
    isGenre: ResponseGenreDto;
    error: ErrorInterface;
  }> {
    let error: ErrorInterface = null;

    genre = genre.toLowerCase();

    const isGenre = await this.genreService.findOneByName(genre);
    if (!isGenre) {
      error = {
        message: `Genre ${genre} does not exist`,
        code: 404,
      };
    }

    return { isGenre, error };
  }
}
