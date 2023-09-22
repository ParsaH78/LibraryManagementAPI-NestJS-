import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ConflictException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { GenreService } from 'src/resources/genre/genre.service';
import { ResponseGenreDto } from 'src/resources/genre/dto/response-genre.dto';
import { ErrorInterface } from './interfaces/error.interface';
import { ResponseAuthorDto } from '../author/dto';

@Controller('book')
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly genreService: GenreService,
  ) {}

  @Roles('ADMIN')
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const isBook = await this.bookService.findOneByName(createBookDto.title);

    if (Object.keys(isBook).length !== 0)
      throw new ConflictException('There is already a book with this title');

    const { author, error } = await this.bookService.isAuthorValid(
      createBookDto.author_name,
    );

    if (error) throw new HttpException(error.message, error.code);

    const { genre_data, err } = await this.genreProcessor(createBookDto.genres);

    if (err) throw new HttpException(err.message, err.code);

    return this.bookService.create(createBookDto, genre_data, author);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.findOne(id);
  }

  @Get('/title/:title')
  findOneByName(@Param('title') title: string) {
    return this.bookService.findOneByName(title);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const isBook = await this.bookService.findOne(id);

    if (Object.keys(isBook).length === 0)
      throw new NotFoundException('There is No Book with this ID');

    let new_author: ResponseAuthorDto = {
      id: isBook.author_id,
      name: isBook.author.name,
    };

    if ('author_name' in updateBookDto) {
      const { author, error } = await this.bookService.isAuthorValid(
        updateBookDto.author_name,
      );

      new_author = author;

      if (error) throw error;
    }

    // eslint-disable-next-line prefer-const
    let { genre_data, err } = await this.genreProcessor(updateBookDto.genres);

    if (genre_data?.length == 0) genre_data = isBook.genres;

    if (err) throw err;

    return this.bookService.update(id, updateBookDto, genre_data, new_author);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.remove(id);
  }

  async genreProcessor(genres: string[]) {
    let genre_data: ResponseGenreDto[] = [];
    let err: ErrorInterface = null;

    for (const genre of genres) {
      const { isGenre, error } = await this.bookService.genreValidation(genre);
      if (!error) {
        genre_data = [...genre_data, isGenre];
      } else {
        err = error;
      }
    }

    return { genre_data, err };
  }
}
