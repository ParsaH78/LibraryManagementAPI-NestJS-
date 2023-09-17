import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [PrismaModule],
  controllers: [GenreController],
  providers: [
    GenreService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [GenreService],
})
export class GenreModule {}
