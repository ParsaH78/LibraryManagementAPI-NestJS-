import { Controller, Post, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateBookDto } from './dtos/book.dtos';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles('ADMIN')
  @Post('/')
  createBook(@Body() body: CreateBookDto) {
    return this.bookService.createBook(body);
  }
}
