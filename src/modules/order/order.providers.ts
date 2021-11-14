import { Connection } from 'typeorm';
import { Order } from './entity';
import { ProductOrder } from './entity/productOrder.entity';

export const OrderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Order),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'PRODUCT_ORDER_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(ProductOrder),
    inject: ['DATABASE_CONNECTION'],
  },
];
