import { Buyer } from '../buyer/entity';
import { Connection } from 'typeorm';

export const BuyerProviders = [
  {
    provide: 'BUYER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Buyer),
    inject: ['DATABASE_CONNECTION'],
  },
];
