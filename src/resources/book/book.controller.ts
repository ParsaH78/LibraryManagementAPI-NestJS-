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
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { GenreService } from 'src/resources/genre/genre.service';
import { ResponseGenreDto } from 'src/resources/genre/dto/response-genre.dto';

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

    if (isBook)
      throw new ConflictException('There is already a book with this title');

    let genre_data: ResponseGenreDto[] = [];

    for (const genre of createBookDto.genres) {
      const { isGenre, error } = await this.bookService.genreValidation(genre);
      if (!error) {
        genre_data = [...genre_data, isGenre];
      } else {
        throw error;
      }
    }

    return this.bookService.create(createBookDto, genre_data);
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.remove(id);
  }
}
