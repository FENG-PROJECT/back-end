import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Product } from 'src/modules/product/entity';
import { OrderStatus } from 'src/utils/constant';
import { ProductOrder } from './productOrder.entity';

@Entity('orders')
export class Order extends BaseEntity {
  constructor(name: string, phone: string, address: string, email: string) {
    super();
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.email = email;
    this.status = OrderStatus.PENDING;
  }

  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column()
  public address: string;

  @Column()
  public email: string;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
  public productOrders: ProductOrder[];

  @Column()
  public totalPrice: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  public note: string;

  @Column()
  public status: string;
}
