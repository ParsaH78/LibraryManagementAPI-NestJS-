import { Injectable } from '@nestjs/common';
import { CreateBorrowHistoryDto } from './dto/create-borrow_history.dto';
import { UpdateBorrowHistoryDto } from './dto/update-borrow_history.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBorrowHistoryDto } from './dto/response_borrow_history.dto';

@Injectable()
export class BorrowHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createBorrowHistoryDto: CreateBorrowHistoryDto,
    user_id: string,
  ) {
    const history = await this.prismaService.borrow_history.create({
      data: {
        ...createBorrowHistoryDto,
        user_id,
      },
      include: {
        borrow: {
          select: {
            expires: true,
            deadline: true,
            date_of_borrow: true,
            returned: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            user_type: true,
            username: true,
          },
        },
      },
    });
    return new ResponseBorrowHistoryDto(history);
  }

  async findAll() {
    const all_histories = await this.prismaService.borrow_history.findMany({
      include: {
        borrow: {
          select: {
            expires: true,
            deadline: true,
            date_of_borrow: true,
            returned: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            user_type: true,
            username: true,
          },
        },
      },
    });
    return all_histories.map(
      (history) => new ResponseBorrowHistoryDto(history),
    );
  }

  async findOne(id: string) {
    const history = await this.prismaService.borrow_history.findUnique({
      where: {
        id,
      },
      include: {
        borrow: {
          select: {
            expires: true,
            deadline: true,
            date_of_borrow: true,
            returned: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            user_type: true,
            username: true,
          },
        },
      },
    });
    return new ResponseBorrowHistoryDto(history);
  }

  async update(id: string, updateBorrowHistoryDto: UpdateBorrowHistoryDto) {
    const updated_history = await this.prismaService.borrow_history.update({
      where: {
        id,
      },
      data: updateBorrowHistoryDto,
      include: {
        borrow: {
          select: {
            expires: true,
            deadline: true,
            date_of_borrow: true,
            returned: true,
          },
        },
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            user_type: true,
            username: true,
          },
        },
      },
    });
    return new ResponseBorrowHistoryDto(updated_history);
  }

  async remove(id: string) {
    await this.prismaService.borrow_history.delete({
      where: {
        id,
      },
    });
    return { message: `History with ID ${id} has been removed` };
  }
}
