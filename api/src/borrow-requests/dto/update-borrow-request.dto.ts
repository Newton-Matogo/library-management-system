import { IsIn, IsOptional, IsDateString } from 'class-validator';

export class UpdateBorrowRequestDto {
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'BORROWED', 'RETURNED'])
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
