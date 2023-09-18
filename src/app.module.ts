import { Module } from '@nestjs/common';
import { AuthModule } from './resources/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { UserInterceptor } from './interceptors/user.interceptor';
import { AuthorModule } from './resources/author/author.module';
import { ScoreModule } from './resources/score/score.module';
import { CommentModule } from './resources/comment/comment.module';
import { GenreModule } from './resources/genre/genre.module';
import { BorrowsModule } from './resources/borrows/borrows.module';
import { UserModule } from './resources/user/user.module';
import { BookModule } from './resources/book/book.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    BookModule,
    AuthorModule,
    ScoreModule,
    CommentModule,
    GenreModule,
    BorrowsModule,
  ],
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
