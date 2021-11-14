import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { ProductController } from './product.controller';
import { ProductProviders } from './product.providers';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import path = require('path');
import { CategoryProviders } from '../category/category.providers';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: './uploads/products',
          filename: (req, file, cb) => {
            const filename: string =
              path.parse(file.originalname).name.replace(/\s/g, '') +
              Date.now();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [...ProductProviders, ...CategoryProviders, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
