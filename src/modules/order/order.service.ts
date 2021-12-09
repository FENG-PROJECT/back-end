import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from 'src/utils/constant';
import { In, Not, Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { Product } from '../product/entity';
import { ProductStock } from '../product/entity/productStock.entity';
import { CreateOrderDto } from './dto';
import { UpdateStatusOrderDto } from './dto/updateStatusOrder.dto';
import { Order } from './entity';
import { ProductOrder } from './entity/productOrder.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly mailService: MailService,
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject('PRODUCT_ORDER_REPOSITORY')
    private productOrderRepository: Repository<ProductOrder>,
    @Inject('PRODUCT_STOCK_REPOSITORY')
    private productStockRepository: Repository<ProductStock>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const { name, phone, address, email, productOrders } = createOrderDto;

      const products =
        productOrders.length > 0
          ? await this.productRepository.find({
              where: {
                id: In(productOrders.map((i) => i.productId)),
              },
            })
          : [];
      if (products.length === 0) return false;
      const order = new Order(name, phone, address, email);

      order.totalPrice = productOrders.reduce(
        (acc, curr) =>
          acc +
            curr.amount *
              products.find((e) => e.id === curr.productId)?.price || 0,
        0,
      );
      order.note = createOrderDto.note;
      await this.orderRepository.save(order);

      for (const _product of productOrders) {
        const product = products.find((e) => e.id === _product.productId);
        const { amount, size, color } = _product;
        const productOrder = new ProductOrder(
          order,
          product,
          amount,
          size,
          color,
        );
        await this.productOrderRepository.save(productOrder);
      }
      const newOrder = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.productOrders', 'productOrders')
        .leftJoinAndSelect('productOrders.product', 'product')
        .getOne();

      this.mailService.sendMail(order.email, 'Billing', 'billing', {
        name: newOrder.name,
        phone: newOrder.phone,
        address: newOrder.address,
        totalPrice: newOrder.totalPrice,
        products: newOrder.productOrders.map((p) => ({
          name: p.product.name,
          price: p.product.price,
          quantity: p.amount,
          amount: p.product.price * p.amount,
        })),
      });
      return {
        id: newOrder.id,
        name: newOrder.name,
        phone: newOrder.phone,
        address: newOrder.address,
        email: newOrder.email,
        products: newOrder.productOrders?.map((e) => ({
          product: e.product.name,
          price: e.product.price,
          amount: e.amount,
        })),
        totalPrice: newOrder.totalPrice,
        note: newOrder.note,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOrders(orderStatus: OrderStatus, search: string) {
    try {
      let query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.productOrders', 'productOrders')
        .leftJoinAndSelect('productOrders.product', 'product')
        .where('TRUE');
      if (orderStatus) {
        query = query.andWhere('order.status = :orderStatus', {
          orderStatus: orderStatus,
        });
      }
      if (search) {
        query = query.andWhere(
          '(LOWER(order.name) LIKE LOWER(:search) OR LOWER(order.phone) LIKE LOWER(:search) OR LOWER(order.address) LIKE LOWER(:search))',
          {
            search: `%${search}%`,
          },
        );
      }
      const orders = await query.orderBy('order.updatedAt', 'DESC').getMany();
      return orders.map((o) => ({
        id: o.id,
        name: o.name,
        phone: o.phone,
        address: o.address,
        email: o.email,
        status: o.status,
        totalPrice: o.totalPrice,
        note: o.note,
        createdAt: o.createdAt,
        products: o.productOrders.map((p) => ({
          id: p.product?.id,
          name: p.product?.name,
          amount: p.amount,
          size: p.size,
          color: p.color,
        })),
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateOrder(orderId: number, updateStatusOrder: UpdateStatusOrderDto) {
    try {
      const order = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.productOrders', 'productOrders')
        .leftJoinAndSelect('productOrders.product', 'product')
        .leftJoinAndSelect('product.productStocks', 'productStocks')
        .where('order.id = :orderId', { orderId: orderId })
        .getOne();
      if (
        !order ||
        order.status === OrderStatus.SUCCESSFUL ||
        order.status === OrderStatus.REJECT
      )
        return false;

      order.status = updateStatusOrder.status;
      if (order.status === OrderStatus.SUCCESSFUL) {
        for (const productOrder of order.productOrders) {
          const product = productOrder.product.productStocks.find(
            (e) => e.size == productOrder.size,
          );
          if (product) product.amount -= productOrder.amount;

          await this.productStockRepository.save(product);
        }
      }
      await this.orderRepository.save(order);
      return {
        message: 'success',
        statusOrder: updateStatusOrder.status,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getOrderByEmail(email: string) {
    try {
      let query = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.productOrders', 'productOrders')
        .leftJoinAndSelect('productOrders.product', 'product')
        .where('order.email = :email', { email: email });

      const orders = await query.orderBy('order.updatedAt', 'DESC').getMany();
      return orders.map((o) => ({
        id: o.id,
        name: o.name,
        phone: o.phone,
        address: o.address,
        email: o.email,
        status: o.status,
        totalPrice: o.totalPrice,
        note: o.note,
        createdAt: o.createdAt,
        products: o.productOrders.map((p) => ({
          id: p.product?.id,
          name: p.product?.name,
          amount: p.amount,
          size: p.size,
          color: p.color,
        })),
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
