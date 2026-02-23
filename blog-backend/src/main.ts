import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  // Enable CORS
  app.enableCors();
  // Get config
  const config = app.get(ConfigService);
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.use(cookieParser());
  // Start server 
  const port = config.get('port');
  await app.listen(port, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`Application is running on.🚀🚀🚀: ${url}`);
}
bootstrap();