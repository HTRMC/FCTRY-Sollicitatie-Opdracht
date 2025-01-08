// src/books/dto/create-book.dto.ts
import { IsString, IsNotEmpty, IsISBN, IsDateString, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsISBN()
  @IsNotEmpty()
  ISBN: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  author: string;

  @IsDateString()
  @IsNotEmpty()
  publishedDate: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  summary: string;
}