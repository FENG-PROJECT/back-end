import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { CategoryController } from './category.controller';
import { CategoryProviders } from './category.providers';
import { CategoryService } from './category.service';
import { diskStorage } from 'multer';
import path = require('path');

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [...CategoryProviders, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
