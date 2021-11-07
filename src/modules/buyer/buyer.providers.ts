import { Connection } from 'typeorm';
import { Buyer } from './entity';

export const BuyerProviders = [
  {
    provide: 'BUYER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Buyer),
    inject: ['DATABASE_CONNECTION'],
  }
];
