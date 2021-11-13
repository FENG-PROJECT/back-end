import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Image } from './image.entity';

@Entity('collections')
export class Collection extends BaseEntity {
  constructor(title: string, description: string) {
    super();
    this.title = title;
    this.description = description;
  }

  @Column({
    unique: true,
  })
  public title: string;

  @Column({
    type: 'text',
  })
  public description: string;

  @OneToMany(() => Image, (image) => image.collection)
  public images: Image[];
}
