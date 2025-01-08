// src/books/dto/update-book.dto.ts
import { IsString, IsOptional, IsISBN, IsDateString, MinLength } from 'class-validator';

export class UpdateBookDto {
  @IsISBN()
  @IsOptional()
  ISBN?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  author?: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @IsString()
  @IsOptional()
  @MinLength(10)
  summary?: string;
}