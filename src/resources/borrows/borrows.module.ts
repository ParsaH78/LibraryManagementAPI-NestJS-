import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BookModule } from '../book/book.module';

@Module({
  imports: [PrismaModule, BookModule],
  controllers: [BorrowsController],
  providers: [
    BorrowsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
  exports: [BorrowsService],
})
export class BorrowsModule {}
