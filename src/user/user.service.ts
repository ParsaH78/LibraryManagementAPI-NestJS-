import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dtos/user.dto';
import { UpdateUser, selectUserData } from './interfaces/usert.interface';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(id: string) {
    const data: selectUserData = {
      username: true,
      email: true,
      phone_number: true,
      address: true,
    };
    const user = await this.userExistence(id, data);

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    return new UserResponseDto(user);
  }

  async updateUser(data: UpdateUser, id: string) {
    const user = await this.userExistence(id);

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

  async deleteUser(id: string) {
    const user = await this.userExistence(id);

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return { message: user.username + ' Deleted !' };
  }

  async userExistence(id: string, select: selectUserData = { username: true }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: select,
    });

    return user;
  }
}
