// src/books/dto/update-book.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsISBN, IsDateString, MinLength } from 'class-validator';

export class UpdateBookDto {
  @ApiPropertyOptional({
    description: 'The ISBN of the book',
    example: '978-3-16-148410-0'
  })
  @IsISBN()
  @IsOptional()
  ISBN?: string;

  @ApiPropertyOptional({
    description: 'The title of the book',
    example: 'The Great Gatsby'
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;

  @ApiPropertyOptional({
    description: 'The author of the book',
    example: 'F. Scott Fitzgerald'
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  author?: string;

  @ApiPropertyOptional({
    description: 'The date the book was published',
    example: '2025-08-01'
  })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @ApiPropertyOptional({
    description: 'A summary of the book',
    example: 'The story primarily concerns the young and mysterious millionaire Jay Gatsby...',
    minLength: 10
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  summary?: string;
}