import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Post()
  create(@Body() createScoreDto: CreateScoreDto, @User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }
    return this.scoreService.create(createScoreDto, user.id);
  }

  @Get()
  findAll() {
    return this.scoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.scoreService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScoreDto: UpdateScoreDto,
    @User() user: UserInfo,
  ) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }

    const isScore = await this.scoreService.findOne(id);

    if (!isScore) {
      throw new NotFoundException('There is no score with this ID');
    }

    if (isScore.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to change other's scores",
      );
    }
    return this.scoreService.update(id, updateScoreDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @User() user: UserInfo) {
    if (!user) {
      throw new UnauthorizedException('You need to login first');
    }

    const isScore = await this.scoreService.findOne(id);

    if (!isScore) {
      throw new NotFoundException('There is no score with this ID');
    }

    if (isScore.user_id !== user.id) {
      throw new UnauthorizedException(
        "You are not allowed to change other's scores",
      );
    }

    return this.scoreService.remove(id);
  }
}
