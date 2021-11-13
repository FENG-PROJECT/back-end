import { Connection } from 'typeorm';
import { Image, Collection } from './entity';

export const CollectionProviders = [
  {
    provide: 'COLLECTION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Collection),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'IMAGE_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Image),
    inject: ['DATABASE_CONNECTION'],
  },
];
