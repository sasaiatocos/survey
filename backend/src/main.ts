import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const options: NestApplicationOptions = {
    bodyParser: false,
  };
  const app = await NestFactory.create(AppModule, options);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: '*',
  });
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
