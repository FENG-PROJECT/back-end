import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { OrderController } from './order.controller';
import { OrderProviders } from './order.providers';
import { OrderService } from './order.service';
import { diskStorage } from 'multer';
import path = require('path');

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [...OrderProviders, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
