import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthorService } from '../../author/author.service';
import { ResponseBookDto } from '../dto/response-book.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authorService: AuthorService,
  ) {}
  async create(createBookDto: CreateBookDto): Promise<ResponseBookDto> {
    const author = await this.authorService.findOneByName(
      createBookDto.author_name,
    );

    if (!author) {
      throw new HttpException(
        'There is no author with this name',
        HttpStatus.NOT_FOUND,
      );
    }

    const book = await this.prismaService.book.create({
      data: {
        title: createBookDto.title,
        description: createBookDto.description,
        pages: createBookDto.pages,
        published_at: createBookDto.published_at,
        author_id: author.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new ResponseBookDto(book);
  }

  async findAll(): Promise<ResponseBookDto[]> {
    const books = await this.prismaService.book.findMany({
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return books.map((book) => {
      return new ResponseBookDto(book);
    });
  }

  async findOne(id: string): Promise<ResponseBookDto> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        genres: {
          select: {
            genre: true,
          },
        },
        // borrowed: {
        //   select: {
        //     returned: true,
        //     id: true,
        //   },
        // },
      },
    });
    return new ResponseBookDto(book);
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    const isBook = await this.findOne(id);

    if (!isBook) {
      throw new HttpException(
        'There is No Book with this ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const updated_book = await this.prismaService.book.update({
      where: {
        id,
      },
      data: updateBookDto,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return new ResponseBookDto(updated_book);
  }

  async remove(id: string): Promise<{ message: string }> {
    const book = await this.prismaService.book.delete({
      where: { id },
    });
    return { message: `Book with name ${book.title} has been removed !` };
  }
}
