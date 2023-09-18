import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('borrows')
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto, @User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }
    return this.borrowsService.create(createBorrowDto, user.id);
  }

  @Get()
  findAll() {
    return this.borrowsService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowsService.findOne(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBorrowDto: UpdateBorrowDto,
    @User() user: UserInfo,
  ) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }

    const isBorrow = await this.borrowsService.findOne(id);

    if (!isBorrow) {
      throw new NotFoundException('There is no score with this ID');
    }

    if (isBorrow.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to change other's scores",
      );
    }
    return this.borrowsService.update(id, updateBorrowDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }

    const isBorrow = await this.borrowsService.findOne(id);

    if (!isBorrow) {
      throw new NotFoundException('There is no score with this ID');
    }

    if (isBorrow.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to change other's scores",
      );
    }
    return this.borrowsService.remove(id);
  }
}
