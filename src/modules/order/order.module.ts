import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { OrderController } from './order.controller';
import { OrderProviders } from './order.providers';
import { OrderService } from './order.service';
import { diskStorage } from 'multer';
import path = require('path');
import { ProductProviders } from '../product/product.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [...OrderProviders, ...ProductProviders, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
