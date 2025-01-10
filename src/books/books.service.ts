// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { BookNotFoundException } from '../common/exceptions/book-not-found.exception';
import { PaginatedBooksDto } from './dto/paginated-books.dto';

@Injectable()
export class BooksService {
   constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) { }

   async create(createBookDto: any | any[]): Promise<Book | Book[]> {
      try {
         if (Array.isArray(createBookDto)) {
            return this.bookModel.insertMany(createBookDto) as Promise<Book[]>;
         }
         const createdBook = new this.bookModel(createBookDto);
         return createdBook.save();
      } catch (error) {
         throw (error);
      }
   }

   async findAll(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedBooksDto> {
      try {
         // Ensure page and limit are positive
         page = Math.max(1, page);
         limit = Math.max(1, Math.min(limit, 100)); // Max 100 items per page
         const skip = (page - 1) * limit;

         // Build search query
         const searchQuery: { $or?: any[] } = {};
         if (search) {
            searchQuery.$or = [
               { ISBN: { $regex: search, $options: 'i' } },
               { title: { $regex: search, $options: 'i' } },
               { author: { $regex: search, $options: 'i' } },
               { summary: { $regex: search, $options: 'i' } },
               {
                  $expr: {
                     $regexMatch: {
                        input: { $dateToString: { format: "%Y-%m-%d", date: "$publishedDate" } },
                        regex: search,
                        options: "i"
                     }
                  }
               }
            ];
         }

         // Execute queries
         const total = await this.bookModel.countDocuments(searchQuery);
         const books = await this.bookModel
            .find(searchQuery)
            .skip(skip)
            .limit(limit)
            .exec();

         return {
            books,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
         };
      } catch (error) {
         throw error;
      }
   }

   async findByISBN(ISBN: string): Promise<Book> {
      const book = await this.bookModel.findOne({ ISBN }).exec();
      if (!book) {
         throw new BookNotFoundException(ISBN);
      }
      return book;
   }

   async update(ISBN: string, updateBookDto: any): Promise<Book> {
      const updatedBook = await this.bookModel.findOneAndUpdate({ ISBN }, updateBookDto, { new: true }).exec();
      if (!updatedBook) {
         throw new BookNotFoundException(ISBN);
      }
      return updatedBook;
   }

   async delete(ISBN: string): Promise<Book> {
      const deletedBook = await this.bookModel.findOneAndDelete({ ISBN }).exec();
      if (!deletedBook) {
         throw new BookNotFoundException(ISBN);
      }
      return deletedBook;
   }
}