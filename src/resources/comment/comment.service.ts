import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/decorators/user.decorator';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, user: UserInfo) {
    const new_comment = await this.prismaService.comment.create({
      data: {
        ...createCommentDto,
        user_id: user.id,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            username: true,
            user_type: true,
          },
        },
      },
    });

    return new ResponseCommentDto(new_comment);
  }

  async findAll() {
    const comments = await this.prismaService.comment.findMany({
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            username: true,
            user_type: true,
          },
        },
      },
    });
    return comments.map((comment) => new ResponseCommentDto(comment));
  }

  async findUsersComments(id: string) {
    const comments = await this.prismaService.comment.findMany({
      where: {
        user_id: id,
      },
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            username: true,
            user_type: true,
          },
        },
      },
    });
    return comments.map((comment) => new ResponseCommentDto(comment));
  }

  async findOne(id: string) {
    const comment = await this.prismaService.comment.findUnique({
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
            username: true,
            user_type: true,
          },
        },
      },
    });
    return new ResponseCommentDto(comment);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const updatedComment = await this.prismaService.comment.update({
      where: {
        id,
      },
      data: updateCommentDto,
      include: {
        book: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            username: true,
            user_type: true,
          },
        },
      },
    });

    return new ResponseCommentDto(updatedComment);
  }

  async remove(id: string) {
    await this.prismaService.comment.delete({
      where: {
        id,
      },
    });

    return `Comment with ID ${id} has been deleted`;
  }
}
