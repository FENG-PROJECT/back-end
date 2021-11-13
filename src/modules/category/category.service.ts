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
    @Inject('SUB_CATEGORY_REPOSITORY')
    private subCategoryRepository: Repository<SubCategory>,
  ) {}

  async getCategories() {
    try {
      const categories = await this.categoryRepository.find();
      return categories.map((c) => ({
        id: c.id,
        name: c.name,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getSubCategoriesByCategoryName(nameCategory: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { name: nameCategory },
      });
      if (!category) return false;

      const subCategories = await this.subCategoryRepository.find({
        where: {
          category: { id: category.id },
        },
      });
      return subCategories.map((c) => ({
        id: c.id,
        name: c.name,
      }));
    } catch (error) {
      throw error;
    }
  }
}
