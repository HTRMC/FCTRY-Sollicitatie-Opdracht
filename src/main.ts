import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

/**
* Bootstrap the NestJS application
* Configures global pipes, filters and Swagger documentation
*/
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Configure global exception filters
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new MongoExceptionFilter()
  );

  // Configure global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,                        // Strip properties that don't have decorators
    forbidNonWhitelisted: true,             // Throw errors if non-whitelisted values are provided
    transform: true,                        // Automatically transform payloads to be objects typed according to their DTO classes
  }));

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bookstore API')
    .setDescription('The Bookstore API description')
    .setVersion('1.0')
    .addTag('books')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
