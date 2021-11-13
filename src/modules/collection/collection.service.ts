import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateBuyerDto } from './dto';
import { Collection } from './entity';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(
    @Inject('COLLECTION_REPOSITORY')
    private collectionRepository: Repository<Collection>,
  ) {}
}
