import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BooksService } from './books.service';
import { Book, BookDocument } from './schemas/book.schema';

describe('BooksService', () => {
  let service: BooksService;
  let model: Model<BookDocument>;

  const mockBook = {
    ISBN: '978-3-16-148410-0',
    title: 'Test Book',
    author: 'Test Author',
    publishedDate: new Date('2024-01-01'),
    summary: 'Test Summary'
  };

  // Mock class to handle both static and instance methods
  class MockBookModel {
    constructor(private data) {
      this.data = data;
    }

    save = jest.fn().mockResolvedValue(this.data);

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

  beforeEach(async () => {
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
    it('should create a single book', async () => {
      const result = await service.create(mockBook);
      expect(result).toBeDefined();
      if (result instanceof MockBookModel) {
        expect(result.save).toHaveBeenCalled();
      }
    });

    it('should create multiple books', async () => {
      const mockBooks = [mockBook, { ...mockBook, ISBN: '978-3-16-148410-1' }];
      const result = await service.create(mockBooks);
      
      expect(MockBookModel.insertMany).toHaveBeenCalledWith(mockBooks);
      expect(result).toEqual([mockBook]);
    });
  });

  describe('findAll', () => {
    it('should return paginated books when no search param is provided', async () => {
      const page = 1;
      const limit = 10;
      const total = 1;
      const totalPages = Math.ceil(total / limit);
  
      MockBookModel.countDocuments.mockResolvedValueOnce(total); // Mock countDocuments
      MockBookModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]), // Mock find
      });
  
      const result = await service.findAll(page, limit);
  
      expect(MockBookModel.countDocuments).toHaveBeenCalled();
      expect(MockBookModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        books: [mockBook],
        total,
        page,
        limit,
        totalPages,
      });
    });
  
    it('should return filtered books when a search param is provided', async () => {
      const page = 1;
      const limit = 10;
      const search = 'test';
      const total = 1;
      const totalPages = Math.ceil(total / limit);
  
      MockBookModel.countDocuments.mockResolvedValueOnce(total); // Mock countDocuments
      MockBookModel.find.mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBook]), // Mock find with filters
      });
  
      const result = await service.findAll(page, limit, search);
  
      expect(MockBookModel.countDocuments).toHaveBeenCalledWith({
        $or: [
          { ISBN: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $dateToString: { format: '%Y-%m-%d', date: '$publishedDate' } },
                regex: search,
                options: 'i',
              },
            },
          },
        ],
      });
      expect(MockBookModel.find).toHaveBeenCalledWith({
        $or: [
          { ISBN: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $dateToString: { format: '%Y-%m-%d', date: '$publishedDate' } },
                regex: search,
                options: 'i',
              },
            },
          },
        ],
      });
      expect(result).toEqual({
        books: [mockBook],
        total,
        page,
        limit,
        totalPages,
      });
    });
  });  
  
  describe('findByISBN', () => {
    it('should return a book by ISBN', async () => {
      const result = await service.findByISBN(mockBook.ISBN);
      
      expect(MockBookModel.findOne).toHaveBeenCalledWith({ ISBN: mockBook.ISBN });
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
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
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const result = await service.delete(mockBook.ISBN);
      
      expect(MockBookModel.findOneAndDelete).toHaveBeenCalledWith({ ISBN: mockBook.ISBN });
      expect(result).toEqual(mockBook);
    });
  });
});