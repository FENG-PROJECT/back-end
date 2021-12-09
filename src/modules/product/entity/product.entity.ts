import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { ProductStatus } from 'src/utils/constant';
import { ProductStock } from './productStock.entity';
import { SubCategory } from 'src/modules/category/entity';
import { Order } from 'src/modules/order/entity';
import { ProductOrder } from 'src/modules/order/entity/productOrder.entity';

@Entity('products')
export class Product extends BaseEntity {
  constructor(
    subCategory: SubCategory,
    name: string,
    price: number,
    priceUS: number,
    priceOld: number,
    priceUSOld: number,
    arrival: string,
    color: unknown[],
    description: string,
    status: ProductStatus,
  ) {
    super();
    this.subCategory = subCategory;
    this.name = name;
    this.price = price;
    this.priceUS = priceUS;
    this.priceOld = priceOld;
    this.priceUSOld = priceUSOld;
    this.arrival = arrival;
    this.color = color;
    this.description = description;
    this.status = status;
    this.deleted = false;
  }

  @ManyToOne(() => SubCategory, {
    eager: true,
  })
  @JoinColumn({ name: 'sub_category_id' })
  public subCategory: SubCategory;

  @Column()
  public name: string;

  @Column({
    nullable: true,
  })
  public price: number;

  @Column({
    nullable: true,
  })
  public priceUS: number;

  @Column({
    nullable: true,
  })
  public priceOld: number;

  @Column({
    nullable: true,
  })
  public priceUSOld: number;

  @Column({
    nullable: true,
  })
  public arrival: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  color: unknown[];

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  images: string[];

  @Column()
  public status: ProductStatus;

  @OneToMany(() => ProductStock, (productStock) => productStock.product)
  public productStocks: ProductStock[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  public productOrders: ProductOrder[];

  @Column({
    default: false,
  })
  public deleted: boolean;
}
