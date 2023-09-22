import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseGenreDto } from './dto/response-genre.dto';
@Injectable()
export class GenreService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<ResponseGenreDto> {
    const isGenre: ResponseGenreDto = await this.findOne(createGenreDto.genre);

    if (isGenre) {
      throw new ConflictException('This genre has already been added !');
    }

    try {
      const genre: ResponseGenreDto = await this.prismaService.genre.create({
        data: createGenreDto,
        select: {
          id: true,
          genre: true,
        },
      });

      return new ResponseGenreDto(genre);
    } catch (error) {
      throw new HttpException(
        `Error in adding a genre : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseGenreDto[]> {
    try {
      const genres = await this.prismaService.genre.findMany({
        select: { id: true, genre: true },
      });

      return genres.map((genre) => new ResponseGenreDto(genre));
    } catch (error) {
      throw new HttpException(
        `Error in getting all genres : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseGenreDto> {
    try {
      const genre = await this.prismaService.genre.findUnique({
        where: { id },
        select: { id: true, genre: true },
      });
      return new ResponseGenreDto(genre);
    } catch (error) {
      throw new HttpException(
        `Error in getting genre by ID: \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByName(name: string): Promise<ResponseGenreDto> {
    try {
      const genre = await this.prismaService.genre.findUnique({
        where: { genre: name },
        select: { id: true, genre: true },
      });

      return new ResponseGenreDto(genre);
    } catch (error) {
      throw new HttpException(
        `Error in getting genre by Name : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateGenreDto: UpdateGenreDto,
  ): Promise<ResponseGenreDto> {
    const isGenre = await this.findOne(id);

    if (!isGenre) {
      throw new NotFoundException('There is no genre with this ID !');
    }

    try {
      const updated_genre = await this.prismaService.genre.update({
        where: {
          id,
        },
        data: updateGenreDto,
      });

      return new ResponseGenreDto(updated_genre);
    } catch (error) {
      throw new HttpException(
        `Error in updating a genre : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deleted_genre = await this.prismaService.genre.delete({
        where: {
          id,
        },
      });

      return { message: `${deleted_genre.genre} Genre has been removed !` };
    } catch (error) {
      throw new HttpException(
        `Error in removing a genre : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
