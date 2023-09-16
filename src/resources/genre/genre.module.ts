import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { GenreService } from './services/genre.service';
import { GenreController } from './controllers/genre.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BookModule } from '../book/book.module';
import { GenreBookService } from './services/genre-book.service';

@Module({
  imports: [PrismaModule, BookModule],
  controllers: [GenreController],
  providers: [
    GenreService,
    GenreBookService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class GenreModule {}
