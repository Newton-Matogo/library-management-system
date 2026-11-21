import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';

import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto } from './dto/create-borrow-request.dto';
import { UpdateBorrowRequestDto } from './dto/update-borrow-request.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('borrow-requests')
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  // A logged-in user can create borrowing requests.
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() createBorrowRequestDto: CreateBorrowRequestDto,
  ) {
    const userId = req.user.userId;

    return this.borrowRequestsService.create(userId, createBorrowRequestDto);
  }

  // Only librarians can view all borrowing requests.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Get()
  findAll() {
    return this.borrowRequestsService.findAll();
  }

  // Only librarians can update borrowing requests.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIBRARIAN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBorrowRequestDto: UpdateBorrowRequestDto,
  ) {
    return this.borrowRequestsService.update(id, updateBorrowRequestDto);
  }
}
