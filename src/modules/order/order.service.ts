import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateBuyerDto } from './dto';
import { Order } from './entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
  ) {}
}
