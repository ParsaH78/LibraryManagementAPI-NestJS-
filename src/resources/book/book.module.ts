import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorModule } from '../author/author.module';
import { BookGenreService } from './services/book-genre.service';
import { BookGenreController } from './controllers/book-genre.controller';
import { GenreModule } from '../genre/genre.module';

@Module({
  imports: [PrismaModule, AuthorModule, GenreModule],
  controllers: [BookController, BookGenreController],
  providers: [
    BookService,
    BookGenreService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [BookService],
})
export class BookModule {}
