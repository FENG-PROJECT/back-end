import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import * as express from "express";
import { join } from "path";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('tiny'));
  app.use(json({limit: '50mb'}))
  app.use("/", express.static(join(__dirname, "..", "uploads")));
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || 'api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 4500);
}
bootstrap();
