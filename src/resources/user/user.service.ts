import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';

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

    const new_user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        user_type: UserType.MEMBER,
      },
    });

    return new_user;
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
