// src/books/books.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created.', type: Book })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createBookDto: CreateBookDto | CreateBookDto[]): Promise<Book | Book[]> {
      return this.booksService.create(createBookDto);
   }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter books', type: String })
  @ApiResponse({ status: 200, description: 'Return all books.', type: [Book] })
  async findAll(@Query('search') search?: string): Promise<Book[]> {
   return this.booksService.findAll(search);
  }

  @Get(':isbn')
  @ApiOperation({ summary: 'Get a book by ISBN' })
  @ApiParam({ name: 'isbn', description: 'The ISBN of the book', type: String })
  @ApiResponse({ status: 200, description: 'Return the book.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async findOne(@Param('isbn') ISBN: string): Promise<Book> {
    return this.booksService.findByISBN(ISBN);
  }

  @Put(':isbn')
  @ApiOperation({ summary: 'Update a book by ISBN' })
  @ApiParam({ name: 'isbn', required: true, description: 'ISBN of the book to update', type: String })
  @ApiResponse({ status: 200, description: 'The book has been successfully updated.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async update(@Param('isbn') ISBN: string, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
    return this.booksService.update(ISBN, updateBookDto);
  }

  @Delete(':isbn')
  @ApiOperation({ summary: 'Delete a book by ISBN' })
  @ApiParam({ name: 'isbn', required: true, description: 'ISBN of the book to delete', type: String })
  @ApiResponse({ status: 200, description: 'The book has been successfully deleted.', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async delete(@Param('isbn') ISBN: string): Promise<Book> {
    return this.booksService.delete(ISBN);
  }
} 
