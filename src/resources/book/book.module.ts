import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorModule } from '../author/author.module';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [PrismaModule, AuthorModule, GenreModule],
  controllers: [BookController],
  providers: [
    BookService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [BookService],
})
export class BookModule {}
