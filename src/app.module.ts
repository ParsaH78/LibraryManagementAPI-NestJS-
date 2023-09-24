import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
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
import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
} from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 36000,
      store: redisStore as unknown as CacheStore,
      host: 'localhost',
      port: 6379,
    }),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
