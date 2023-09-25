import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcrypt';
import { BorrowsService } from '../borrows/borrows.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly borrowService: BorrowsService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const isUser = await this.findOneByEmail(createUserDto.email);

    if (isUser) {
      throw new ConflictException('User already exists !');
    }

    const salt: string = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    try {
      const new_user = await this.prismaService.user.create({
        data: {
          ...createUserDto,
          user_type: UserType.MEMBER,
        },
      });

      return new ResponseUserDto(new_user);
    } catch (error) {
      throw new HttpException(
        `Error in creating user : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseUserDto[]> {
    try {
      const users = await this.prismaService.user.findMany({
        include: {
          scores: {
            select: {
              score: true,
            },
          },
          comments: {
            select: {
              comment: true,
            },
          },
        },
      });
      return users.map((user) => new ResponseUserDto(user));
    } catch (error) {
      throw new HttpException(
        `Error in getting all users : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: {
          scores: {
            select: {
              score: true,
            },
          },
          comments: {
            select: {
              comment: true,
            },
          },
        },
      });
      return new ResponseUserDto(user);
    } catch (error) {
      throw new HttpException(
        `Error in getting a user by ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByEmail(email: string): Promise<ResponseUserDto> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
        include: {
          scores: {
            select: {
              score: true,
            },
          },
          comments: {
            select: {
              comment: true,
            },
          },
        },
      });
      return new ResponseUserDto(user);
    } catch (error) {
      throw new HttpException(
        `Error in getting a user by Email : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const isUser = this.findOne(id);

    if (!isUser) {
      throw new NotFoundException('There is no user with this ID');
    }

    if (updateUserDto?.password) {
      const salt: string = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    try {
      const updated_user = await this.prismaService.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });

      return new ResponseUserDto(updated_user);
    } catch (error) {
      throw new HttpException(
        `Error in updating user : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      return { message: `User ${id} has been removed` };
    } catch (error) {
      throw new HttpException(
        `Error in removing user : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getBorrowHistory(user_id: string) {
    const history = await this.prismaService.borrows.findMany({
      where: {
        user_id,
        returned: true,
      },
      include: {
        book: {
          select: {
            title: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return history;
  }

  async searchUsers(username: string): Promise<ResponseUserDto[]> {
    const homes = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: username,
        },
      },
      include: {
        scores: {
          select: {
            score: true,
          },
        },
        comments: {
          select: {
            comment: true,
          },
        },
      },
    });

    return homes.map((home) => {
      return new ResponseUserDto(home);
    });
  }
}
