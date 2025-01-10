// src/common/exceptions/book-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

/**
* Custom exception for when a book cannot be found by ISBN
* Extends NestJS NotFoundException to maintain proper error handling
*/
export class BookNotFoundException extends NotFoundException {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} not found`);
  }
}