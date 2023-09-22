import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseBorrowDto } from './dto/response-borrow.dto';

@Injectable()
export class BorrowsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createBorrowDto: CreateBorrowDto,
    user_id: string,
  ): Promise<ResponseBorrowDto> {
    const hasBorrowed = await this.findOneByBookId(createBorrowDto.book_id);

    if (hasBorrowed) {
      throw new ConflictException('This book has already been borrowed');
    }
    try {
      const borrow = await this.prismaService.borrows.create({
        data: {
          ...createBorrowDto,
          user_id,
        },
      });
      return new ResponseBorrowDto(borrow);
    } catch (error) {
      throw new HttpException(
        `Error in borrowing a book : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseBorrowDto[]> {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error in getting all borrows : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseBorrowDto> {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error in getting a borrow : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByBookId(book_id: string): Promise<ResponseBorrowDto> {
    try {
      const hasBorrowed = await this.prismaService.borrows.findUnique({
        where: {
          book_id,
        },
      });

      return new ResponseBorrowDto(hasBorrowed);
    } catch (error) {
      throw new HttpException(
        `Error in getting a borrow by book ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateBorrowDto: UpdateBorrowDto,
  ): Promise<ResponseBorrowDto> {
    const isBorrow = await this.findOne(id);

    if (!isBorrow) {
      throw new NotFoundException('This user did not borrow this book');
    }

    try {
      const updated_borrow = await this.prismaService.borrows.update({
        where: {
          id,
        },
        data: updateBorrowDto,
      });

      return new ResponseBorrowDto(updated_borrow);
    } catch (error) {
      throw new HttpException(
        `Error in getting a borrow by book ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.borrows.delete({
        where: {
          id,
        },
      });

      return { message: `Borrow with ID ${id} has been removed` };
    } catch (error) {
      throw new HttpException(
        `Error in getting a borrow by book ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
