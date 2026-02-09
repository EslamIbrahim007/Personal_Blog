import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(config.get('port'));
  console.log(`Application is running on.🚀🚀🚀: ${await app.getUrl()}`);
}
bootstrap();