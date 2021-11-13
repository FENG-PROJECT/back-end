import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Category } from './';

@Entity('sub_categories')
export class SubCategory extends BaseEntity {
  constructor(name: string, category: Category) {
    super();
    this.name = name;
    this.category = category;
  }

  @Column({
    unique: true,
  })
  public name: string;

  @ManyToOne(() => Category, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  public category: Category;
}
