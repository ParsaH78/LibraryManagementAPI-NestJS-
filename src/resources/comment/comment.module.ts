import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BookModule } from '../book/book.module';

@Module({
  imports: [PrismaModule, BookModule],
  controllers: [CommentController],
  providers: [
    CommentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class CommentModule {}
