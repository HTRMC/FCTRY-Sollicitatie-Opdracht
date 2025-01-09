// src/common/exceptions/book-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class BookNotFoundException extends NotFoundException {
  constructor(isbn: string) {
    super(`Book with ISBN ${isbn} not found`);
  }
}