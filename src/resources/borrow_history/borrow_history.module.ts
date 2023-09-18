import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { BorrowHistoryService } from './borrow_history.service';
import { BorrowHistoryController } from './borrow_history.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [BorrowHistoryController],
  providers: [
    BorrowHistoryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class BorrowHistoryModule {}
