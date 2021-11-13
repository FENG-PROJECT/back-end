import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { ProductStatus } from 'src/utils/constant';
import { ProductStock } from './productStock.entity';

@Entity('products')
export class Product extends BaseEntity {
  constructor(
    name: string,
    price: number,
    arrival: string,
    status: ProductStatus,
  ) {
    super();
    this.name = name;
    this.price = price;
    this.arrival = arrival;
    this.status = status;
  }

  @Column({
    unique: true,
  })
  public name: string;

  @Column({
    nullable: true,
  })
  public price: number;

  @Column({
    nullable: true,
  })
  public arrival: string;

  @Column()
  public status: ProductStatus;

  @OneToMany(() => ProductStock, (productStock) => productStock.product)
  public productStocks: ProductStock[];
}
