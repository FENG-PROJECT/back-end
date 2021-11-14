import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { CreateCollectionDto } from './dto';
import { Collection } from './entity';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(
    @Inject('COLLECTION_REPOSITORY')
    private collectionRepository: Repository<Collection>,
  ) {}

  async getCollection() {
    try {
      const collections = await this.collectionRepository
        .createQueryBuilder('collection')
        .leftJoinAndSelect('collection.images', 'images')
        .orderBy('collection.updatedAt', 'DESC')
        .getMany();

      return collections;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createCollection(createCollectionDto: CreateCollectionDto) {
    try {
      const collection = new Collection(
        createCollectionDto.title,
        createCollectionDto.description,
      );
      await this.collectionRepository.save(collection);
      return {
        id: collection.id,
        title: collection.title,
        description: collection.description,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateCollection(
    collectionId: number,
    createCollectionDto: CreateCollectionDto,
  ) {
    try {
      const collection = await this.collectionRepository.findOne(collectionId);
      if (!collection) return false;

      collection.title = createCollectionDto.title;
      collection.description = createCollectionDto.description;

      await this.collectionRepository.save(collection);
      return {
        id: collection.id,
        title: collection.title,
        description: collection.description,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
