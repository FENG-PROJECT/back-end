import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateBuyerDto } from './dto';
import { Category, SubCategory } from './entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}
}
