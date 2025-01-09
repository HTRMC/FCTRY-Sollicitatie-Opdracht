// src/common/filters/mongo-exception.filter.ts
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = 500;
    let message = 'Internal server error';

    switch (exception.code) {
      case 11000: // Duplicate key error
        status = 409;
        message = 'Duplicate entry';
        break;
      default:
        status = 500;
        message = 'Database operation failed';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
      path: ctx.getRequest().url,
    });
  }
}