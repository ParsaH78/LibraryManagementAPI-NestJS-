import { Test, TestingModule } from '@nestjs/testing';
import { BorrowHistoryController } from './borrow_history.controller';
import { BorrowHistoryService } from './borrow_history.service';

describe('BorrowHistoryController', () => {
  let controller: BorrowHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowHistoryController],
      providers: [BorrowHistoryService],
    }).compile();

    controller = module.get<BorrowHistoryController>(BorrowHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
