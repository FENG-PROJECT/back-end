import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrderController } from './order.controller';
import { OrderProviders } from './order.providers';
import { OrderService } from './order.service';
import { ProductProviders } from '../product/product.providers';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [OrderController],
  providers: [...OrderProviders, ...ProductProviders, OrderService],
  exports: [OrderService],
})
export class OrderModule {}
