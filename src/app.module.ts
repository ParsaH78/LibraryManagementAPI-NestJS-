import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthorModule } from './author/author.module';
import { ScoreModule } from './score/score.module';
import { CommentModule } from './comment/comment.module';
import { GenreModule } from './genre/genre.module';
import { BorrowsModule } from './borrows/borrows.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, BookModule, AuthorModule, ScoreModule, CommentModule, GenreModule, BorrowsModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
