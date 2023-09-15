import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SelectUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';

export const userData: SelectUserDto = {
  username: true,
  email: true,
  phone_number: true,
  address: true,
};
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(id: string) {
    const user = await this.userExistence(id, userData);

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    return new UserResponseDto(user);
  }

  async updateUser(data: UpdateUserDto, id: string) {
    const user = await this.userExistence(id);

    if (!user) {
      throw new NotFoundException('User not found !');
    }

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data,
      select: userData,
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

  async userExistence(id: string, select: SelectUserDto = { username: true }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: select,
    });

    return user;
  }
}
