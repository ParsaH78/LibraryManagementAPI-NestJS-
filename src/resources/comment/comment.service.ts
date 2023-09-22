import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInfo } from 'src/decorators/user.decorator';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { BookService } from '../book/book.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bookService: BookService,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: UserInfo,
  ): Promise<ResponseCommentDto> {
    const isBook = await this.bookService.findOne(createCommentDto.book_id);

    if (!isBook) throw new NotFoundException('There is no book with this ID');

    try {
      const new_comment = await this.prismaService.comment.create({
        data: {
          ...createCommentDto,
          user_id: user.id,
        },
      });

      return new ResponseCommentDto(new_comment);
    } catch (error) {
      throw new HttpException(
        `Error in adding a comment : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseCommentDto[]> {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error in getting all comments : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUsersComments(id: string): Promise<ResponseCommentDto[]> {
    try {
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
        },
      });
      return comments.map((comment) => new ResponseCommentDto(comment));
    } catch (error) {
      throw new HttpException(
        `Error in getting a user's comment : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseCommentDto> {
    try {
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
    } catch (error) {
      throw new HttpException(
        `Error in getting a comment by ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<ResponseCommentDto> {
    try {
      const updatedComment = await this.prismaService.comment.update({
        where: {
          id,
        },
        data: updateCommentDto,
      });

      return new ResponseCommentDto(updatedComment);
    } catch (error) {
      throw new HttpException(
        `Error in updating a comment : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.comment.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error in removing a comment : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: `Comment with ID ${id} has been deleted` };
  }
}
