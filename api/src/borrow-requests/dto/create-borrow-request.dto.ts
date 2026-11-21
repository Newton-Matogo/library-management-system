import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class CreateBorrowRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  bookIds: string[];
}
