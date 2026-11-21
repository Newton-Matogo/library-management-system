import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsISBN,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  author: string;

  @IsOptional()
  @IsString()
  @IsISBN()
  isbn?: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsString()
  @IsNotEmpty()
  genreId: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  publishedYear?: number;
}
