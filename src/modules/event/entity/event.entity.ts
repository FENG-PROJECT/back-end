import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';

@Entity('events')
export class Event extends BaseEntity {
  constructor(content: string, link: string) {
    super();
    this.content = content;
    this.link = link;
  }

  @Column()
  public content: string;

  @Column()
  public link: string;
}
