import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateBuyerDto } from './dto';
import { Product } from './entity';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}
}
