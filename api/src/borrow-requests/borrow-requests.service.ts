import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';
import { calculateFine } from './fine-calculator';

@Injectable()
export class BorrowRequestsService {
  // Fine charged per overdue day.
  private readonly fineRatePerDay = 50;

  constructor(private readonly prisma: PrismaService) {}

  // Create borrowing requests for a user's selected books.
  async create(userId: string, createBorrowRequestDto: CreateBorrowRequestDto) {
    const bookIds = [...new Set(createBorrowRequestDto.bookIds)];

    const books = await this.prisma.book.findMany({
      where: {
        id: { in: bookIds },
      },
    });

    if (books.length !== bookIds.length) {
      throw new NotFoundException(
        'One or more requested books could not be found',
      );
    }

    const requests = await this.prisma.$transaction(
      bookIds.map((bookId) =>
        this.prisma.borrowRequest.create({
          data: {
            userId,
            bookId,
          },
          include: {
            book: true,
          },
        }),
      ),
    );

    return {
      message: 'Borrowing requests created successfully',
      data: requests,
    };
  }

  // Allow librarians to view all borrowing requests.
  async findAll() {
    return this.prisma.borrowRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Allow librarians to update a borrowing request.
  async update(id: string, updateBorrowRequestDto: UpdateBorrowRequestDto) {
    const existingRequest = await this.prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      throw new NotFoundException('Borrowing request not found');
    }

    const { status, dueDate, returnDate } = updateBorrowRequestDto;

    if (returnDate && status !== 'RETURNED') {
      throw new BadRequestException(
        'A return date can only be provided when marking a book as RETURNED',
      );
    }

    const updateData: {
      status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BORROWED' | 'RETURNED';
      dueDate?: Date;
      returnDate?: Date;
      fineAmount?: number;
    } = {};

    if (status) {
      updateData.status = status as
        'PENDING' | 'APPROVED' | 'REJECTED' | 'BORROWED' | 'RETURNED';
    }

    if (dueDate) {
      updateData.dueDate = new Date(dueDate);
    }

    if (status === 'RETURNED') {
      const actualReturnDate = returnDate ? new Date(returnDate) : new Date();

      const actualDueDate = dueDate
        ? new Date(dueDate)
        : existingRequest.dueDate;

      if (!actualDueDate) {
        throw new BadRequestException(
          'A due date must be set before returning a book',
        );
      }

      if (actualReturnDate < existingRequest.requestDate) {
        throw new BadRequestException(
          'Return date cannot be before the borrowing request date',
        );
      }

      updateData.returnDate = actualReturnDate;
      updateData.fineAmount = calculateFine(
        actualDueDate,
        actualReturnDate,
        this.fineRatePerDay,
      );
    } else if (returnDate) {
      updateData.returnDate = new Date(returnDate);
    }

    return this.prisma.borrowRequest.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: true,
      },
    });
  }
}
