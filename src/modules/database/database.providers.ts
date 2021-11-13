import * as path from 'path';

import { createConnection } from 'typeorm';

export const DatabaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'mysql',

        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,

        entities: [path.resolve(__dirname, '..', '**/*.entity{.ts,.js}')],
        synchronize: true,
        // ssl: { rejectUnauthorized: false },
        // logging: true,
      }),
  },
];
