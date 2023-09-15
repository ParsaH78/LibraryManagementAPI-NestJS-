import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.findOne(id);
  }

  @Roles('ADMIN')
  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Roles('ADMIN')
  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.authorService.remove(id);
  }
}
