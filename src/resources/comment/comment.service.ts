import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    return createCommentDto;
  }

  async findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} comment`;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return updateCommentDto;
  }

  async remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
