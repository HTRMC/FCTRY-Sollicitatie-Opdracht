# FCTRY-Sollicitatie-Opdracht

## Overview
This project is a RESTful API built with NestJS for managing a collection of books. It provides features like CRUD operations, search functionality, and Dockerized deployment.

## Features

### 1. Book Schema (book.schema.ts)
Defines the book model with fields:
- `ISBN`: Unique identifier
- `title`: Book title
- `author`: Book author
- `publishedDate`: Publication date
- `summary`: Book description

### 2. Data Validation
Validation is implemented using `class-validator` in DTOs:
- `CreateBookDto`: Validates book creation
- `UpdateBookDto`: Validates book updates

Validation rules include:
- ISBN format validation
- Non-empty fields
- Minimum length checks

### 3. API Endpoints (books.controller.ts)
Provides CRUD operations:
- `POST /books`: Create book(s)
- `GET /books`:  List books with optional search, like /books?search=harry&page=1&limit=10
- `GET /books/:isbn`: Retrieve book by ISBN
- `PUT /books/:isbn`: Update book
- `DELETE /books/:isbn`: Delete book

### 4. Search Functionality
Implemented in `books.service.ts` with case-insensitive searching across:
- ISBN
- Title
- Author
- Summary
- Published Date

### 5. Error Handling
Custom exception filters:
- `HttpExceptionFilter`: Handles HTTP exceptions
- `MongoExceptionFilter`: Handles MongoDB-specific errors

Error management includes:
- Duplicate key errors
- Meaningful error responses

### 6. Testing
Comprehensive test suites created with the assistance of ChatGPT:
- `books.controller.spec.ts`
- `books.service.spec.ts`

Tests cover all CRUD operations and mock MongoDB interactions.

### 7. API Documentation
Integrated with Swagger:
- Detailed API endpoint descriptions
- Request/response schemas
- Accessible via `/api` endpoint

### 8. Docker Support
- `Dockerfile`: Containerizes the application
- `docker-compose.yml`: Defines services
  - NestJS API service
  - MongoDB service

### 9. Development Environment
Technologies and tools used:
- TypeScript
- NestJS
- Mongoose
- MongoDB
- Jest for testing

### 10. Running the Project

#### Prerequisites
- Docker
- Docker Compose
- NodeJS

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/HTRMC/FCTRY-Sollicitatie-Opdracht.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FCTRY-Sollicitatie-Opdracht
   ```
3. Run the application:
   ```bash
   docker-compose up --build
   ```
#### Testing
1. Clone the repository:
   ```bash
   git clone https://github.com/HTRMC/FCTRY-Sollicitatie-Opdracht.git
   ```
2. Navigate to the project directory:
   ```bash
   cd FCTRY-Sollicitatie-Opdracht
   ```
3. Install modules:
   ```bash
   npm install
   ```
4. Run test command:
   ```bash
   npm test
   ```

#### Test Data
Postman or curl is recommended for doing the POST, GET, PUT & DELETE request
```json
[
  {
    "ISBN": "978-0-7475-3269-9",
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J.K. Rowling",
    "publishedDate": "1997-06-26",
    "summary": "Harry Potter's journey begins as he discovers he is a wizard and attends Hogwarts School of Witchcraft and Wizardry."
  },
  {
    "ISBN": "978-0-7475-3849-3",
    "title": "Harry Potter and the Chamber of Secrets",
    "author": "J.K. Rowling",
    "publishedDate": "1998-07-02",
    "summary": "In Harry's second year at Hogwarts, students are being petrified and a mysterious Chamber of Secrets has been opened."
  },
  {
    "ISBN": "978-0-7475-4215-5",
    "title": "Harry Potter and the Prisoner of Azkaban",
    "author": "J.K. Rowling",
    "publishedDate": "1999-07-08",
    "summary": "Harry learns about escaped prisoner Sirius Black and the dark truth about his parents' betrayal."
  },
  {
    "ISBN": "978-0-7475-4624-5",
    "title": "Harry Potter and the Goblet of Fire",
    "author": "J.K. Rowling",
    "publishedDate": "2000-07-08",
    "summary": "Harry is mysteriously entered into the dangerous Triwizard Tournament as dark forces gather strength."
  },
  {
    "ISBN": "978-0-7475-5100-3",
    "title": "Harry Potter and the Order of the Phoenix",
    "author": "J.K. Rowling",
    "publishedDate": "2003-06-21",
    "summary": "Harry and his friends form 'Dumbledore's Army' to prepare for the coming war with Voldemort."
  },
  {
    "ISBN": "978-0-7475-8108-7",
    "title": "Harry Potter and the Half-Blood Prince",
    "author": "J.K. Rowling",
    "publishedDate": "2005-07-16",
    "summary": "Dumbledore begins to prepare Harry for his final battle with Voldemort by revealing the dark lord's past."
  },
  {
    "ISBN": "978-0-545-01022-1",
    "title": "Harry Potter and the Deathly Hallows",
    "author": "J.K. Rowling",
    "publishedDate": "2007-07-21",
    "summary": "The final battle for Hogwarts commences as Harry hunts for the remaining Horcruxes to defeat Voldemort."
  }
]
```

### Accessing the API
- Swagger Documentation: [http://localhost:3000/api](http://localhost:3000/api)
- API Endpoints: [http://localhost:3000/books](http://localhost:3000/books)