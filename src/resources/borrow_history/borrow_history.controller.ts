import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BorrowHistoryService } from './borrow_history.service';
import { CreateBorrowHistoryDto } from './dto/create-borrow_history.dto';
import { UpdateBorrowHistoryDto } from './dto/update-borrow_history.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('borrow-history')
export class BorrowHistoryController {
  constructor(private readonly borrowHistoryService: BorrowHistoryService) {}

  @Post()
  create(
    @Body() createBorrowHistoryDto: CreateBorrowHistoryDto,
    @User() user: UserInfo,
  ) {
    return this.borrowHistoryService.create(createBorrowHistoryDto, user.id);
  }

  @Get()
  findAll() {
    return this.borrowHistoryService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowHistoryService.findOne(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBorrowHistoryDto: UpdateBorrowHistoryDto,
    @User() user: UserInfo,
  ) {
    const isHistory = await this.borrowHistoryService.findOne(id);

    if (!isHistory) {
      throw new NotFoundException('There is no history with this ID');
    }

    if (isHistory.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to change other's history",
      );
    }
    return this.borrowHistoryService.update(id, updateBorrowHistoryDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @User() user: UserInfo) {
    const isHistory = await this.borrowHistoryService.findOne(id);

    if (!isHistory) {
      throw new NotFoundException('There is no history with this ID');
    }

    if (isHistory.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to remove other's history",
      );
    }

    return this.borrowHistoryService.remove(id);
  }
}
