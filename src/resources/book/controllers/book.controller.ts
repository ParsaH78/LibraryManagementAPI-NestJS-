import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
