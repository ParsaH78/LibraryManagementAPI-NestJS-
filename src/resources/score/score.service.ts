import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseScoreDto } from './dto/response-score.dto';

@Injectable()
export class ScoreService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createScoreDto: CreateScoreDto,
    user_id: string,
  ): Promise<ResponseScoreDto> {
    try {
      const new_score = await this.prismaService.score.create({
        data: {
          ...createScoreDto,
          user_id,
        },
      });

      return new ResponseScoreDto(new_score);
    } catch (error) {
      throw new HttpException(
        `Error in adding a score : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<ResponseScoreDto[]> {
    try {
      const scores = await this.prismaService.score.findMany({
        include: {
          book: {
            select: {
              title: true,
            },
          },
          user: {
            select: {
              user_type: true,
              username: true,
            },
          },
        },
      });
      return scores.map((score) => new ResponseScoreDto(score));
    } catch (error) {
      throw new HttpException(
        `Error in getting all scores : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string): Promise<ResponseScoreDto> {
    try {
      const score = await this.prismaService.score.findUnique({
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
              user_type: true,
              username: true,
            },
          },
        },
      });
      return new ResponseScoreDto(score);
    } catch (error) {
      throw new HttpException(
        `Error in getting score by ID : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: string,
    updateScoreDto: UpdateScoreDto,
  ): Promise<ResponseScoreDto> {
    try {
      const updated_score = await this.prismaService.score.update({
        where: {
          id,
        },
        data: updateScoreDto,
      });
      return new ResponseScoreDto(updated_score);
    } catch (error) {
      throw new HttpException(
        `Error in updating score : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prismaService.score.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        `Error in removing score : \n ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: `Score with ID ${id} has been removed ` };
  }
}
