import { Connection } from 'typeorm';
import { Category } from './entity';
import { SubCategory } from './entity/subCategory.entity';

export const CategoryProviders = [
  {
    provide: 'CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Category),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'SUB_CATEGORY_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(SubCategory),
    inject: ['DATABASE_CONNECTION'],
  },
];
