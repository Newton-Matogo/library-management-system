import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
