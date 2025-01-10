import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoError } from 'mongodb';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';
import { BookNotFoundException } from '../common/exceptions/book-not-found.exception';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;
  let mockSave: jest.Mock;

  // Test data used across test cases
  const mockBook = {
    ISBN: '978-3-16-148410-0',
    title: 'Test Book',
    author: 'Test Author',
    publishedDate: new Date('2024-01-01'),
    summary: 'Test Summary'
  };

  // Mock save method separately to allow modifying its behavior
  mockSave = jest.fn().mockResolvedValue(mockBook);

  /**
 * Mock Mongoose Model implementation
 * Includes both instance methods (save) and static methods (find, findOne, etc)
 */
  class MockBookModel {
    constructor(private data) {
      this.data = data;
    }

    save = mockSave;

    static find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockBook])
    });

    static findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook)
    });

    static findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook)
    });

    static findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockBook)
    });

    static insertMany = jest.fn().mockResolvedValue([mockBook]);

    static countDocuments = jest.fn().mockResolvedValue(1);
  }

  // Reset mocks and set up test module before each test
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: MockBookModel
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    model = module.get<Model<BookDocument>>(getModelToken(Book.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    // Test single book creation success case
    it('should create a single book', async () => {
      const result = await service.create(mockBook);
      expect(result).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
    });

    // Test bulk book creation
    it('should create multiple books', async () => {
      const mockBooks = [mockBook, { ...mockBook, ISBN: '978-3-16-148410-1' }];
      const result = await service.create(mockBooks);

      expect(MockBookModel.insertMany).toHaveBeenCalledWith(mockBooks);
      expect(result).toEqual([mockBook]);
    });

    // Test duplicate ISBN error handling
    it('should handle duplicate key error', async () => {
      const duplicateError = new MongoError('Duplicate key error');
      duplicateError.code = 11000;

      mockSave.mockRejectedValueOnce(duplicateError);

      await expect(service.create(mockBook))
        .rejects
        .toThrow(MongoError);
    });
  });

  describe('findAll', () => {
    // Test pagination without search parameters
    it('should return paginated books when no search param', async () => {
      MockBookModel.countDocuments = jest.fn().mockResolvedValue(1);
      MockBookModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]),
      });

      const page = 1;
      const limit = 10;

      const result = await service.findAll(page, limit);

      expect(MockBookModel.countDocuments).toHaveBeenCalledWith({});
      expect(MockBookModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual({
        books: [mockBook],
        total: 1,
        page,
        limit,
        totalPages: 1,
      });
    });

    // Test search functionality with pagination
    it('should return paginated books with search param', async () => {
      MockBookModel.countDocuments = jest.fn().mockResolvedValue(1);
      MockBookModel.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]),
      });

      const page = 1;
      const limit = 10;
      const search = 'Test';

      // Expected MongoDB search query
      const searchQuery = {
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
                options: 'i',
              },
            },
          },
        ],
      };

      const result = await service.findAll(page, limit, search);

      expect(MockBookModel.countDocuments).toHaveBeenCalledWith(searchQuery);
      expect(MockBookModel.find).toHaveBeenCalledWith(searchQuery);
      expect(result).toEqual({
        books: [mockBook],
        total: 1,
        page,
        limit,
        totalPages: 1,
      });
    });
  });


  describe('findByISBN', () => {
    // Test successful book retrieval
    it('should return a book by ISBN', async () => {
      const result = await service.findByISBN(mockBook.ISBN);

      expect(MockBookModel.findOne).toHaveBeenCalledWith({ ISBN: mockBook.ISBN });
      expect(result).toEqual(mockBook);
    });

    // Test book not found error
    it('should throw BookNotFoundException when book not found', async () => {
      MockBookModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      await expect(service.findByISBN('nonexistent-isbn'))
        .rejects
        .toThrow(BookNotFoundException);
    });
  });

  describe('update', () => {
    // Test successful book update
    it('should update a book', async () => {
      const updateDto = { title: 'Updated Title' };
      const result = await service.update(mockBook.ISBN, updateDto);

      expect(MockBookModel.findOneAndUpdate).toHaveBeenCalledWith(
        { ISBN: mockBook.ISBN },
        updateDto,
        { new: true }
      );
      expect(result).toEqual(mockBook);
    });

    // Test update book not found error
    it('should throw BookNotFoundException when updating non-existent book', async () => {
      MockBookModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      await expect(service.update('nonexistent-isbn', { title: 'New Title' }))
        .rejects
        .toThrow(BookNotFoundException);
    });
  });

  describe('delete', () => {
    // Test successful book deletion
    it('should delete a book', async () => {
      const result = await service.delete(mockBook.ISBN);

      expect(MockBookModel.findOneAndDelete).toHaveBeenCalledWith({ ISBN: mockBook.ISBN });
      expect(result).toEqual(mockBook);
    });

    // Test delete book not found error
    it('should throw BookNotFoundException when deleting non-existent book', async () => {
      MockBookModel.findOneAndDelete = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      await expect(service.delete('nonexistent-isbn'))
        .rejects
        .toThrow(BookNotFoundException);
    });
  });
});