// src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
   constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) { }

   async create(createBookDto: any | any[]): Promise<Book | Book[]> {
      if (Array.isArray(createBookDto)) {
         return this.bookModel.insertMany(createBookDto) as Promise<Book[]>;
      }
      const createdBook = new this.bookModel(createBookDto);
         return createdBook.save();
   }

   async findAll(search?: string): Promise<Book[]> {
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

         return this.bookModel.find(searchQuery).exec();
      }
      return this.bookModel.find().exec();
   }

   async findByISBN(ISBN: string): Promise<Book> {
      return this.bookModel.findOne({ ISBN }).exec();
   }

   async update(ISBN: string, updateBookDto: any): Promise<Book> {
      return this.bookModel.findOneAndUpdate({ ISBN }, updateBookDto, { new: true }).exec();
   }

   async delete(ISBN: string): Promise<Book> {
      return this.bookModel.findOneAndDelete({ ISBN }).exec();
   }
}