import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBorrowDto } from './dto/response-borrow.dto';

@Injectable()
export class BorrowsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createBorrowDto: CreateBorrowDto, user_id: string) {
    const hasBorrowed = await this.prismaService.borrows.findUnique({
      where: {
        book_id: createBorrowDto.book_id,
      },
    });

    if (hasBorrowed) {
      throw new ConflictException('This book has already been borrowed');
    }

    const borrow = await this.prismaService.borrows.create({
      data: {
        ...createBorrowDto,
        user_id,
      },
      include: {
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
    return new ResponseBorrowDto(borrow);
  }

  async findAll() {
    const borrows = await this.prismaService.borrows.findMany({
      include: {
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
    return borrows.map((borrow) => new ResponseBorrowDto(borrow));
  }

  async findOne(id: string) {
    const borrow = await this.prismaService.borrows.findUnique({
      where: {
        id,
      },
      include: {
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
    return new ResponseBorrowDto(borrow);
  }

  async update(id: string, updateBorrowDto: UpdateBorrowDto) {
    const isBorrow = await this.findOne(id);

    if (!isBorrow) {
      throw new NotFoundException('This user did not borrow this book');
    }

    const updated_borrow = await this.prismaService.borrows.update({
      where: {
        id,
      },
      data: updateBorrowDto,
      include: {
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

    return new ResponseBorrowDto(updated_borrow);
  }

  async remove(id: string) {
    await this.prismaService.borrows.delete({
      where: {
        id,
      },
    });
    return { message: `Borrow with ID ${id} has been removed` };
  }
}
