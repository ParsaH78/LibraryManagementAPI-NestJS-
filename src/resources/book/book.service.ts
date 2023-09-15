import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateBook } from './interfaces/book.interface';

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  // async createBook(body: CreateBook) {
  //   const book = await this.prismaService.book.create({
  //     data: body,
  //   });

  //   return book;
  // }
}
