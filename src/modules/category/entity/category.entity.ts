import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';

@Entity('categories')
export class Category extends BaseEntity {
  constructor(name: string) {
    super();
    this.name = name;
  }

  @Column({
    unique: true,
  })
  public name: string;
}
