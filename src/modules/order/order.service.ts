import { Inject, Injectable, Logger } from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { Product } from '../product/entity';
import { CreateOrderDto } from './dto';
import { Order } from './entity';
import { ProductOrder } from './entity/productOrder.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject('PRODUCT_ORDER_REPOSITORY')
    private productOrderRepository: Repository<ProductOrder>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const { name, phone, address, productOrders } = createOrderDto;

      const products =
        productOrders.length > 0
          ? await this.productRepository.find({
              where: {
                id: In(productOrders.map((i) => i.productId)),
              },
            })
          : [];
      const order = new Order(name, phone, address);

      order.totalPrice = productOrders.reduce(
        (acc, curr) =>
          acc +
          curr.amount * products.find((e) => e.id === curr.productId).price,
        0,
      );
      await this.orderRepository.save(order);

      for (const _product of products) {
        const amount = productOrders.find(
          (e) => e.productId === _product.id,
        ).amount;
        const productOrder = new ProductOrder(order, _product, amount);
        await this.productOrderRepository.save(productOrder);
      }
      const newOrder = await this.orderRepository.findOne(order.id);

      return {
        id: newOrder.id,
        name: newOrder.name,
        phone: newOrder.phone,
        address: newOrder.address,
        products: newOrder.productOrders?.map((e) => ({
          product: e.product.name,
          price: e.product.price,
          amount: e.amount,
        })),
        totalPrice: newOrder.totalPrice,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
