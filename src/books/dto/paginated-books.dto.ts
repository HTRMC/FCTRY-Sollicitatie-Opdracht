// src/books/dto/paginated-books.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../schemas/book.schema';

export class PaginatedBooksDto {
  @ApiProperty({ description: 'List of books for the current page', type: [Book] })
  books: Book[];

  @ApiProperty({ description: 'Total number of books' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}