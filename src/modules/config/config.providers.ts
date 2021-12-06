import { Connection } from 'typeorm';
import { Config } from './entity';

export const ConfigProviders = [
  {
    provide: 'CONFIG_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Config),
    inject: ['DATABASE_CONNECTION'],
  },
];
