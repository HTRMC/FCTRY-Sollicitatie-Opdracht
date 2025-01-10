import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';

/**
* Root application module
* Configures MongoDB connection and registers feature modules
*/
@Module({
  imports: [
    // Configure MongoDB connection with event handling
    MongooseModule.forRoot('mongodb://mongodb:27017/bookstore', {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB connected successfully to bookstore database');
        });
        connection.on('error', (error) => {
          console.error('MongoDB connection error:', error);
        });
        return connection;
      },
    }),
    BooksModule,  // Register books feature module
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
