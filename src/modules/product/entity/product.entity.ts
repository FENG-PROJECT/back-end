import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/modules/database/entity';
import { ProductStatus } from 'src/utils/constant';
import { ProductStock } from './productStock.entity';
import { SubCategory } from 'src/modules/category/entity';

@Entity('products')
export class Product extends BaseEntity {
  constructor(
    subCategory: SubCategory,
    name: string,
    price: number,
    arrival: string,
    color: string[],
    description: string,
    status: ProductStatus,
  ) {
    super();
    this.subCategory = subCategory;
    this.name = name;
    this.price = price;
    this.arrival = arrival;
    this.color = color;
    this.description = description;
    this.status = status;
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
  public arrival: string;

  @Column({
    type: 'json',
  })
  color: string[];

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
}
