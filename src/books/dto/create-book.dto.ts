// src/books/dto/create-book.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsISBN, IsDateString, MinLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The ISBN of the book',
    example: '978-3-16-148410-0',
  })
  @IsISBN()
  @IsNotEmpty()
  ISBN: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  author: string;

  @ApiProperty({
    description: 'The date the book was published',
    example: '2025-08-01',
  })
  @IsDateString()
  @IsNotEmpty()
  publishedDate: Date;

  @ApiProperty({
    description: 'A summary of the book',
    example: 'The story primarily concerns the young and mysterious millionaire Jay Gatsby...',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  summary: string;
}