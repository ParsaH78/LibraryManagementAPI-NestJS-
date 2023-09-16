import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseGenreDto } from '../dto/response-genre.dto';
@Injectable()
export class GenreService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<ResponseGenreDto> {
    const isGenre: ResponseGenreDto = await this.findOne(createGenreDto.genre);

    if (isGenre) {
      throw new ConflictException('This genre has already been added !');
    }

    const genre: ResponseGenreDto = await this.prismaService.genre.create({
      data: createGenreDto,
      select: {
        id: true,
        genre: true,
      },
    });

    return new ResponseGenreDto(genre);
  }

  async findAll(): Promise<ResponseGenreDto[]> {
    return await this.prismaService.genre.findMany({
      select: { id: true, genre: true },
    });
  }

  async findOne(id: string): Promise<ResponseGenreDto> {
    return await this.prismaService.genre.findUnique({
      where: { id },
      select: { id: true, genre: true },
    });
  }

  async update(
    id: string,
    updateGenreDto: UpdateGenreDto,
  ): Promise<ResponseGenreDto> {
    const isGenre = await this.findOne(id);

    if (!isGenre) {
      throw new NotFoundException('There is no genre with this ID !');
    }

    const updated_genre: ResponseGenreDto =
      await this.prismaService.genre.update({
        where: {
          id,
        },
        data: updateGenreDto,
        select: {
          id: true,
          genre: true,
        },
      });

    return new ResponseGenreDto(updated_genre);
  }

  async remove(id: string): Promise<string> {
    const deleted_genre: ResponseGenreDto =
      await this.prismaService.genre.delete({
        where: {
          id,
        },
        select: {
          id: true,
          genre: true,
        },
      });
    return `${deleted_genre.genre} Genre has been removed !`;
  }
}
