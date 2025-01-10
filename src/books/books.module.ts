// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book, BookSchema } from './schemas/book.schema';

/**
 * Books module that handles all book-related functionality
 * Registers the Mongoose model, controller, and service
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }])],
  controllers: [BooksController], // Handles HTTP requests
  providers: [BooksService],      // Implements business logic
})
export class BooksModule {}