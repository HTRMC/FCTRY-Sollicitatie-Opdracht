// src/books/schemas/book.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @ApiProperty({ description: 'The ISBN of the book', example: '978-3-16-148410-0' })
  @Prop({ required: true, unique: true })
  ISBN: string;

  @ApiProperty({ description: 'The title of the book', example: 'The Great Gatsby' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'The author of the book', example: 'F. Scott Fitzgerald' })
  @Prop({ required: true })
  author: string;

  @ApiProperty({ description: 'The publication date of the book', example: '2024-01-01' })
  @Prop({ required: true })
  publishedDate: Date;

  @ApiProperty({ description: 'A brief summary of the book', example: 'The story primarily concerns the young and mysterious millionaire Jay Gatsby...' })
  @Prop({ required: true })
  summary: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);