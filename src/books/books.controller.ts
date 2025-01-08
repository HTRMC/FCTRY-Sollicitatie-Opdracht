// src/books/books.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: any): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(@Query('search') search?: string): Promise<Book[]> {
   return this.booksService.findAll(search);
  }

  @Get(':isbn')
  async findOne(@Param('isbn') ISBN: string): Promise<Book> {
    return this.booksService.findByISBN(ISBN);
  }

  @Put(':isbn')
  async update(@Param('isbn') ISBN: string, @Body() updateBookDto: any): Promise<Book> {
    return this.booksService.update(ISBN, updateBookDto);
  }

  @Delete(':isbn')
  async delete(@Param('isbn') ISBN: string): Promise<Book> {
    return this.booksService.delete(ISBN);
  }
} 
