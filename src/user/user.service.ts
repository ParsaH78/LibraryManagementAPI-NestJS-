import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        email: true,
        phone_number: true,
        address: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    return new UserResponseDto(user);
  }

  async updateUser(data: UpdateUserDto, id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
      select: {
        username: true,
        email: true,
        address: true,
        phone_number: true,
      },
    });

    return new UserResponseDto(updatedUser);
  }
}
