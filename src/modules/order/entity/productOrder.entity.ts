import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Product } from 'src/modules/product/entity';
import { OrderStatus } from 'src/utils/constant';
import { Order } from '.';

@Entity('products_orders')
export class ProductOrder extends BaseEntity {
  constructor(
    order: Order,
    product: Product,
    amount: number,
    size: string,
    color: string,
  ) {
    super();
    this.order = order;
    this.product = product;
    this.amount = amount;
    this.size = size;
    this.color = color;
  }

  @ManyToOne(() => Order, {
    eager: true,
  })
  @JoinColumn({ name: 'order_id' })
  public order: Order;

  @ManyToOne(() => Product, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @Column()
  public amount: number;

  @Column()
  public size: string;

  @Column({
    nullable: true,
  })
  public color: string;
}
