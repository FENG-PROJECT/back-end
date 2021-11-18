import { Connection } from 'typeorm';
import { Admin } from './entity';

export const AdminProviders = [
  {
    provide: 'ADMIN_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Admin),
    inject: ['DATABASE_CONNECTION'],
  },
];
