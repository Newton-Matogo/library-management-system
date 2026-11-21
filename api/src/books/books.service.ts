import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    const existingBook = await this.prisma.book.findFirst({
      where: {
        OR: [
          { title: createBookDto.title },
          ...(createBookDto.isbn ? [{ isbn: createBookDto.isbn }] : []),
        ],
      },
    });

    if (existingBook) {
      throw new ConflictException(
        'A book with this title or ISBN already exists',
      );
    }

    const genre = await this.prisma.genre.findUnique({
      where: { id: createBookDto.genreId },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return this.prisma.book.create({
      data: createBookDto,
      include: { genre: true },
    });
  }

  async findAll(genreId?: string, search?: string, page = 1, limit = 10) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));

    const where: any = {};

    if (genreId) {
      where.genreId = genreId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        include: { genre: true },
        orderBy: { title: 'asc' },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    if (updateBookDto.genreId) {
      const genre = await this.prisma.genre.findUnique({
        where: { id: updateBookDto.genreId },
      });

      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
    }

    if (updateBookDto.title || updateBookDto.isbn) {
      const existingBook = await this.prisma.book.findFirst({
        where: {
          OR: [
            ...(updateBookDto.title ? [{ title: updateBookDto.title }] : []),
            ...(updateBookDto.isbn ? [{ isbn: updateBookDto.isbn }] : []),
          ],
        },
      });

      if (existingBook && existingBook.id !== id) {
        throw new ConflictException(
          'A book with this title or ISBN already exists',
        );
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
      include: { genre: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
