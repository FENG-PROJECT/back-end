import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { OrderStatus, PaymentType } from 'src/utils/constant';
import { ProductOrder } from './productOrder.entity';

@Entity('orders')
export class Order extends BaseEntity {
  constructor(
    name: string,
    phone: string,
    address: string,
    email: string,
    paymentType: PaymentType,
  ) {
    super();
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.email = email;
    this.paymentType = paymentType;
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

  @Column()
  public paymentType: PaymentType;

  @Column({
    type: 'text',
    nullable: true,
  })
  public note: string;

  @Column()
  public status: string;
}
