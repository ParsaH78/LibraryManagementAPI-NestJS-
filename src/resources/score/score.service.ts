import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseScoreDto } from './dto/response-score.dto';

@Injectable()
export class ScoreService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createScoreDto: CreateScoreDto, user_id: string) {
    const new_score = await this.prismaService.score.create({
      data: {
        ...createScoreDto,
        user_id,
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

    return new ResponseScoreDto(new_score);
  }

  async findAll() {
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
  }

  async findOne(id: string) {
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
  }

  async update(id: string, updateScoreDto: UpdateScoreDto) {
    const updated_score = await this.prismaService.score.update({
      where: {
        id,
      },
      data: updateScoreDto,
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
    return new ResponseScoreDto(updated_score);
  }

  async remove(id: string) {
    await this.prismaService.score.delete({
      where: { id },
    });
    return { message: `Score with ID ${id} has been removed ` };
  }
}
