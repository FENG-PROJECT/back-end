import { Admin } from '../admin/entity';
import { Connection } from 'typeorm';

export const AdminProviders = [
  {
    provide: 'ADMIN_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Admin),
    inject: ['DATABASE_CONNECTION'],
  },
];
