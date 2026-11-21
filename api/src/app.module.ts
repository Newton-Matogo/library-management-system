import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GenresModule } from './genres/genres.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';
import { SpacesModule } from './spaces/spaces.module';

@Module({
  imports: [
    PrismaModule,
    GenresModule,
    BooksModule,
    AuthModule,
    BorrowRequestsModule,
    BookingsModule,
    SpacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
