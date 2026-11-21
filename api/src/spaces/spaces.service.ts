import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.space.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
