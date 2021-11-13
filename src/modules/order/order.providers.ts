import { Connection } from 'typeorm';
import { Order } from './entity';

export const OrderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Order),
    inject: ['DATABASE_CONNECTION'],
  },
];
