import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: UserInfo) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('/user/:id')
  findUserComments(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findUsersComments(id);
  }

  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentService.findOne(id);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserInfo,
  ) {
    const comment = await this.commentService.findOne(id);

    if (!comment) {
      throw new NotFoundException('There is no comment with this ID');
    }

    if (user.id !== comment.user_id) {
      throw new UnauthorizedException("You can't change other's comments");
    }

    return this.commentService.update(id, updateCommentDto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const comment = await this.findOne(id);

    if (!comment) {
      throw new NotFoundException('There is no comment with this ID');
    }

    return this.commentService.remove(id);
  }
}
