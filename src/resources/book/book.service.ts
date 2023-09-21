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

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
  ) {}
  async create(createBookDto: CreateBookDto, genres_data: ResponseGenreDto[]) {
    const { author, error } = await this.isAuthorValid(
      createBookDto.author_name,
    );

    if (error) throw error;

    createBookDto.title = createBookDto.title.toLowerCase();
    const { author_name, genres, ...data } = createBookDto;

    const book = await this.prismaService.book.create({
      data: {
        ...data,
        genres: {
          connect: genres_data,
        },
        author_id: author.id,
      },
    });

    return new ResponseBookDto(book);
  }

  async findAll(): Promise<ResponseBookDto[]> {
    const books = await this.prismaService.book.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return books.map((book) => {
      return new ResponseBookDto(book);
    });
  }

  async findOne(id: string): Promise<ResponseBookDto> {
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
          },
        },
      },
    });
    return new ResponseBookDto(book);
  }

  async findOneByName(title: string): Promise<ResponseBookDto> {
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
            genre: true,
          },
        },
      },
    });
    return new ResponseBookDto(book);
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    const isBook = await this.findOne(id);

    if (!isBook) {
      throw new HttpException(
        'There is No Book with this ID',
        HttpStatus.NOT_FOUND,
      );
    }

    return;

    // const updated_book = await this.prismaService.book.update({
    //   where: {
    //     id,
    //   },
    //   data: updateBookDto,
    //   include: {
    //     author: {
    //       select: {
    //         name: true,
    //       },
    //     },
    //   },
    // });

    // return new ResponseBookDto(updated_book);
  }

  async remove(id: string): Promise<{ message: string }> {
    const book = await this.prismaService.book.delete({
      where: { id },
    });
    return { message: `Book with name ${book.title} has been removed !` };
  }

  async isAuthorValid(author_name: string) {
    let error: HttpException = null;
    const author = await this.authorService.findOneByName(
      author_name.toLowerCase(),
    );

    if (!author) {
      error = new HttpException(
        'There is no author with this name',
        HttpStatus.NOT_FOUND,
      );
    }

    return { author, error };
  }

  async genreValidation(
    genre: string,
  ): Promise<{ isGenre: ResponseGenreDto; error: HttpException }> {
    let error: HttpException = null;

    genre = genre.toLowerCase();

    const isGenre = await this.genreService.findOneByName(genre);
    if (!isGenre) {
      error = new NotFoundException({
        message: `Genre ${isGenre.genre} does not exist`,
      });
    }

    return { isGenre, error };
  }
}
