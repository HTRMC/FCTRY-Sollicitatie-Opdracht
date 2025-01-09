// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { BookNotFoundException } from '../common/exceptions/book-not-found.exception';

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

   async findAll(search?: string): Promise<Book[]> {
      try {
         if (search) {
            const searchQuery: { $or: any[] } = {
               $or: [
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
               ]
            };

            return await this.bookModel.find(searchQuery).exec();
         }
         return await this.bookModel.find().exec();
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