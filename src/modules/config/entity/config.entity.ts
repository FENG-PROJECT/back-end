import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/modules/database/entity';

@Entity('configs')
export class Config extends BaseEntity {
  constructor() {
    super();
  }

  @Column({
    name: 'customer_care',
    nullable: true,
  })
  public customerCare: string;

  @Column({
    name: 'about_us',
    nullable: true,
  })
  public aboutUs: string;

  @Column({
    nullable: true,
  })
  public contact: string;

  @Column({
    nullable: true,
  })
  public title: string;

  @Column({
    nullable: true,
  })
  public description: string;

  @Column({
    nullable: true,
  })
  public image: string;
}
