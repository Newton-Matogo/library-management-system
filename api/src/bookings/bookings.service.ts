import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const { spaceId, startTime, endTime } = createBookingDto;

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(endTime);

    // Ensure the ending time is after the starting time.
    if (bookingEnd <= bookingStart) {
      throw new BadRequestException('End time must be after start time');
    }

    // Check whether the requested space exists.
    const space = await this.prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new NotFoundException('Library space not found');
    }

    // Check whether another active booking overlaps.
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        spaceId,
        status: {
          not: 'CANCELLED',
        },
        startTime: {
          lt: bookingEnd,
        },
        endTime: {
          gt: bookingStart,
        },
      },
    });

    if (conflictingBooking) {
      throw new ConflictException(
        'This space is already booked for the selected time',
      );
    }

    // Create the booking if there is no conflict.
    return this.prisma.booking.create({
      data: {
        userId,
        spaceId,
        startTime: bookingStart,
        endTime: bookingEnd,
      },
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Allow librarians to view all bookings.
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        space: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
