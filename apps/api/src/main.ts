import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });
import * as cookieParser from 'cookie-parser';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DBHelper } from './app/helper/db.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true
  })
  const port = process.env.PORT || 3333;
  await app.listen(port);
  app.useGlobalPipes(new ValidationPipe({whitelist: true,}));
  const url = process.env.DATABASE_URL
 await DBHelper.init(url);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
