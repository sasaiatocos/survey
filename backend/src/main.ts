import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session, { SessionOptions } from 'express-session';
import passport from 'passport';
import { sessionConfig } from './auth/common/session.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(session(sessionConfig as SessionOptions));

  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
