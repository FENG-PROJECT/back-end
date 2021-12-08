import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';

@Entity('subcribes')
export class Subcribe extends BaseEntity {
  constructor(email: string) {
    super();
    this.email = email;
  }

  @Column()
  public email: string;
}
