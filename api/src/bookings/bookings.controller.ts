import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Logged-in users can create bookings.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() createBookingDto: CreateBookingDto) {
    const userId = req.user.userId;

    return this.bookingsService.create(userId, createBookingDto);
  }

  // Only librarians can view all bookings.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }
}
