import * as path from "path";

import {createConnection} from "typeorm";

export const DatabaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: async () =>
      await createConnection({
        type: "postgres",

        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,

        entities: [path.resolve(__dirname, "..", "**/*.entity{.ts,.js}")],
        synchronize: true,
        // ssl: { rejectUnauthorized: false },
        // logging: true,
      }),
  },
];
