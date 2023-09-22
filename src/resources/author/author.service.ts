import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseAuthorDto } from './dto';

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<ResponseAuthorDto> {
    createAuthorDto.name = createAuthorDto.name.toLowerCase();
    try {
      const new_author = await this.prismaService.author.create({
        data: createAuthorDto,
      });
      return new ResponseAuthorDto(new_author);
    } catch (error) {
      throw new HttpException(
        `Error in creating author : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseAuthorDto[]> {
    try {
      const authors = await this.prismaService.author.findMany({});
      return authors.map((author) => new ResponseAuthorDto(author));
    } catch (error) {
      throw new HttpException(
        `Error in getting all authors : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseAuthorDto> {
    try {
      const book = await this.prismaService.author.findUnique({
        where: {
          id,
        },
      });
      return new ResponseAuthorDto(book);
    } catch (error) {
      throw new HttpException(
        `Error in getting author by ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByName(name: string): Promise<ResponseAuthorDto> {
    try {
      const book = await this.prismaService.author.findUnique({
        where: {
          name,
        },
      });
      return new ResponseAuthorDto(book);
    } catch (error) {
      throw new HttpException(
        `Error in getting author by Name : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
  ): Promise<ResponseAuthorDto> {
    const author = await this.findOne(id);

    if (!author) throw new NotFoundException("Author doesn't exists !");

    if (updateAuthorDto?.name)
      updateAuthorDto.name = updateAuthorDto.name.toLowerCase();

    try {
      const new_author = await this.prismaService.author.update({
        where: {
          id,
        },
        data: updateAuthorDto,
      });

      return new ResponseAuthorDto(new_author);
    } catch (error) {
      throw new HttpException(
        `Error in updating authors : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    const author = await this.findOne(id);

    if (!author) throw new NotFoundException("Author doesn't exists !");

    try {
      const author = await this.prismaService.author.delete({
        where: {
          id,
        },
      });

      return `Author ${author.name} has been deleted !`;
    } catch (error) {
      throw new HttpException(
        `Error in removing authors : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
