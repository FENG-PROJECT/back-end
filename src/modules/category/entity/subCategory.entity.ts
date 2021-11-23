import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Category } from './';

@Entity('sub_categories')
export class SubCategory extends BaseEntity {
  constructor(name: string, url: string, category: Category) {
    super();
    this.name = name;
    this.url = url;
    this.category = category;
  }

  @Column()
  public name: string;

  @Column()
  public url: string;

  @ManyToOne(() => Category, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  public category: Category;
}
