import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CollectionModule } from './modules/collection/collection.module';
import { OrderModule } from './modules/order/order.module';
import { EventModule } from './modules/event/event.module';
import { ConfigModule as AppConfigModule } from './modules/config/config.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule,
    HealthModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CollectionModule,
    EventModule,
  ],
})
export class AppModule {}
