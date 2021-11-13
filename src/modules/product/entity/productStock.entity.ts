import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { Product } from '.';

@Entity('product_stock')
export class ProductStock extends BaseEntity {
  constructor(product: Product, size: string, amount: number) {
    super();
    this.product = product;
    this.size = size;
    this.amount = amount;
  }

  @ManyToOne(() => Product, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @Column()
  public size: string;

  @Column()
  public amount: number;
}
