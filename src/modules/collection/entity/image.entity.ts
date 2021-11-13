import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Collection } from './collection.entity';

@Entity('images')
export class Image extends BaseEntity {
  constructor(collection: Collection) {
    super();
    this.collection = collection;
  }
  @ManyToOne(() => Collection, {
    eager: true,
  })
  @JoinColumn({ name: 'collection_id' })
  public collection: Collection;
}
