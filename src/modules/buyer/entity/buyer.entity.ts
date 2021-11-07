import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';

@Entity('buyers')
export class Buyer extends BaseEntity {
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
    nullable: true,
    name: 'email_recovery',
  })
  public emailRecovery: string;

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
  public address: string;

  @Column({
    nullable: true,
  })
  public avatar: string;

  @Column({
    type: 'text',
    name: 'company_description',
    nullable: true,
  })
  public companyDescription: string;

  @Column({
    default: false,
  })
  public isActive: boolean;
}
