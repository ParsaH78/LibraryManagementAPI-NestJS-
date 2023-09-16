import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/decorators/user.decorator';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, user: UserInfo) {
    const new_comment = await this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        user_id: user.id,
      },
    });

    return new_comment;
  }

  async findAll() {
    return await this.prismaService.comment.findMany({});
  }

  async findOne(id: string) {
    return this.prismaService.comment.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return updateCommentDto;
  }

  async remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
