import { Connection } from 'typeorm';
import { Subcribe } from './entity';

export const SubcribeProviders = [
  {
    provide: 'SUBCRIBE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Subcribe),
    inject: ['DATABASE_CONNECTION'],
  },
];
