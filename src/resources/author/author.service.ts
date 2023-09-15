import { Injectable, ConflictException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const author = await this.findOneByName(createAuthorDto.name);

    if (author) {
      throw new ConflictException('Author already exists !');
    }

    const new_author = await this.prismaService.author.create({
      data: createAuthorDto,
    });

    return new_author;
  }

  async findAll() {
    return await this.prismaService.author.findMany({});
  }

  async findOne(id: string) {
    return await this.prismaService.author.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByName(name: string) {
    return this.prismaService.author.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);

    if (!author) {
      throw new ConflictException('Author already exists !');
    }

    const new_author = await this.prismaService.author.update({
      where: {
        id,
      },
      data: updateAuthorDto,
    });

    return new_author;
  }

  async remove(id: string) {
    const author = await this.prismaService.author.delete({
      where: {
        id,
      },
    });
    return `Author ${author.name} has been deleted !`;
  }
}