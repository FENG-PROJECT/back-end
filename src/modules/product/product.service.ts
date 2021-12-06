import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { Category, SubCategory } from '../category/entity';
import { CreateProductDto } from './dto';
import { Product } from './entity';
import { ProductStock } from './entity/productStock.entity';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject('PRODUCT_STOCK_REPOSITORY')
    private productStockRepository: Repository<ProductStock>,
    @Inject('SUB_CATEGORY_REPOSITORY')
    private subCategoryRepository: Repository<SubCategory>,
    @Inject('CATEGORY_REPOSITORY')
    private categoryRepository: Repository<Category>,
  ) {}

  async getProducts(
    category: string,
    subCategoryUrl: string,
    search: string,
    limit: number,
    offset: number,
  ) {
    try {
      let countQuery = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.category', 'category')
        .leftJoinAndSelect('product.productStocks', 'productStocks')
        .where('product.deleted = FALSE');

      let query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.category', 'category')
        .leftJoinAndSelect('product.productStocks', 'productStocks')
        .where('product.deleted = FALSE');

      if (category) {
        query = query.andWhere('category.name = :category', {
          category: category,
        });

        countQuery = countQuery.andWhere('category.name = :category', {
          category: category,
        });
      }

      if (subCategoryUrl) {
        query = query.andWhere('subCategory.url = :subCategoryUrl', {
          subCategoryUrl: subCategoryUrl,
        });

        countQuery = countQuery.andWhere('subCategory.url = :subCategoryUrl', {
          subCategoryUrl: subCategoryUrl,
        });
      }

      if (search) {
        query = query.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
          search: `%${search}%`,
        });

        countQuery = countQuery.andWhere(
          'LOWER(product.name) LIKE LOWER(:search)',
          {
            search: `%${search}%`,
          },
        );
      }

      const [countProduct, products] = await Promise.all([
        countQuery.getCount(),
        query
          .orderBy('product.updatedAt', 'DESC')
          .take(limit || 10)
          .skip(offset || 0)
          .getMany(),
      ]);
      return {
        count: countProduct,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          arrival: p.arrival,
          status: p.status,
          color: p.color,
          description: p.description,
          images: p.images,
          subCategory: {
            id: p.subCategory?.id,
            name: p.subCategory?.name,
            url: p.subCategory.url,
          },
          category: {
            id: p.subCategory.category?.id,
            name: p.subCategory.category?.name,
          },
          productStocks:
            p.productStocks &&
            p.productStocks.map((e) => ({ size: e.size, amount: e.amount })),
        })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getProductDetail(productId: number) {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.category', 'category')
        .leftJoinAndSelect('product.productStocks', 'productStocks')
        .where('product.deleted = FALSE')
        .andWhere('product.id = :productId', { productId: productId })
        .getOne();

      if (!product) return false;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        arrival: product.arrival,
        status: product.status,
        color: product.color,
        description: product.description,
        images: product.images,
        subCategory: {
          id: product.subCategory.id,
          name: product.subCategory.name,
          url: product.subCategory.url,
        },
        category: {
          id: product.subCategory.category.id,
          name: product.subCategory.category.name,
        },
        productStocks:
          product.productStocks &&
          product.productStocks.map((e) => ({
            size: e.size,
            amount: e.amount,
          })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createProduct(createProductdto: CreateProductDto, fileNames: string[]) {
    try {
      const {
        name,
        price,
        arrival,
        color,
        description,
        productStocks,
        status,
      } = createProductdto;
      console.log(createProductdto);
      //check category and sub category
      const subCategory = await this.subCategoryRepository
        .createQueryBuilder('subCategory')
        .leftJoin('subCategory.category', 'category')
        .where('subCategory.url = :url', {
          url: createProductdto.subCategoryUrl,
        })
        .andWhere('category.name = :category', {
          category: createProductdto.category,
        })
        .getOne();
      if (!subCategory) return false;

      const product = new Product(
        subCategory,
        name,
        Number(price),
        arrival,
        JSON.parse(color),
        description,
        status,
      );
      product.images = fileNames.map((e) => `${process.env.URL}/products/${e}`);
      product.productStocks = [];
      for (const _stock of JSON.parse(productStocks)) {
        const { size, amount } = _stock;
        const productStock = new ProductStock(product, size, amount);
        await this.productStockRepository.save(productStock);
        product.productStocks = [...product.productStocks, productStock];
      }

      await this.productRepository.save(product);
      return {
        message: 'success',
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          arrival: product.arrival,
          status: product.status,
          color: product.color,
          description: product.description,
          images: product.images,
        },
      };
    } catch (error) {
      console.log(error, 'error');
      this.logger.error(error);
      throw error;
    }
  }

  async updateProduct(
    productId: number,
    createProductdto: CreateProductDto,
    fileNames: string[],
  ) {
    try {
      const product = await this.productRepository.findOne(productId);
      if (!product) return false;

      const {
        name,
        price,
        arrival,
        color,
        description,
        images,
        status,
        productStocks,
      } = createProductdto;
      //check category and sub category
      const subCategory = await this.subCategoryRepository
        .createQueryBuilder('subCategory')
        .leftJoin('subCategory.category', 'category')
        .where('subCategory.url = :url', {
          url: createProductdto.subCategoryUrl,
        })
        .andWhere('category.name = :category', {
          category: createProductdto.category,
        })
        .getOne();
      if (!subCategory) return false;

      product.name = name;
      product.price = Number(price);
      product.arrival = arrival;
      product.status = status;
      product.color = JSON.parse(color);
      product.description = description;
      product.subCategory = subCategory;
      const removeImages = product.images.filter(
        (x) => !(images || []).includes(x),
      );

      for (const _image of removeImages) {
        if (fs.existsSync(_image.replace(`${process.env.URL}`, 'uploads')))
          fs.unlinkSync(_image.replace(`${process.env.URL}`, 'uploads'));
      }

      product.images = (images && JSON.parse(images)) || [];

      if (fileNames)
        product.images = product.images.concat(
          fileNames.map((e) => `${process.env.URL}/products/${e}`),
        );
      product.productStocks = [];

      for (const _stock of JSON.parse(productStocks)) {
        const { size, amount } = _stock;
        const productStock = new ProductStock(product, size, amount);
        await this.productStockRepository.save(productStock);
        product.productStocks = [...product.productStocks, productStock];
      }

      await this.productRepository.save(product);
      return {
        message: 'success',
        data: {
          id: product.id,
          name: product.name,
          price: product.price,
          arrival: product.arrival,
          status: product.status,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId: number) {
    try {
      const product = await this.productRepository.findOne(productId);
      if (!product || product.deleted) return false;

      product.deleted = true;

      await this.productRepository.save(product);
      return {
        message: 'success',
      };
    } catch (error) {
      throw error;
    }
  }
}
