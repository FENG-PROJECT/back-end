import { Connection } from 'typeorm';
import { Product } from './entity';
import { ProductStock } from './entity/productStock.entity';

export const ProductProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Product),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PRODUCT_STOCK_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(ProductStock),
    inject: ['DATABASE_CONNECTION'],
  },
];
