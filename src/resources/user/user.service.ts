import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import { ResponseUserDto } from './dto/response-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const isUser = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (isUser) {
      throw new ConflictException('User already exists !');
    }

    const salt: string = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const new_user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        user_type: UserType.MEMBER,
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

    return new ResponseUserDto(new_user);
  }

  async findAll() {
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
  }

  async findOne(id: string) {
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
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isUser = this.findOne(id);

    if (!isUser) {
      throw new NotFoundException('There is no user with this ID');
    }

    if (updateUserDto?.password) {
      const salt: string = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updated_user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
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

    return new ResponseUserDto(updated_user);
  }

  async remove(id: string) {
    await this.prismaService.user.delete({
      where: {
        id,
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

    return `User ${id} has been removed`;
  }
}
