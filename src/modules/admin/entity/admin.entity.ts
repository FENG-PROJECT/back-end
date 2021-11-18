import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';

@Entity('admins')
export class Admin extends BaseEntity {
  constructor(email: string, password: string, username: string) {
    super();
    this.email = email;
    this.password = password;
    this.username = username;
  }

  @Column({
    unique: true,
  })
  public email: string;

  @Column({
    unique: true,
    nullable: true,
  })
  public username: string;

  @Column()
  public password: string;

  @Column({
    nullable: true,
  })
  public avatar: string;

  @Column({
    default: false,
  })
  public isActive: boolean;
}
