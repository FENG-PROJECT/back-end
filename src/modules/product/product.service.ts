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
  ) {}

  async getProductBySubCategoryId(subCategoryId: number) {
    try {
      const subCategory = await this.subCategoryRepository.findOne(
        subCategoryId,
      );
      if (!subCategory) return false;

      // const products = await this.productRepository.find({
      //   where: { subCategory: { id: subCategoryId } },
      // });

      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory', 'subCategory')
        .leftJoinAndSelect('product.productStocks', 'productStocks')
        .where('subCategory.id = :subCategoryId', {
          subCategoryId: subCategoryId,
        })
        .orderBy('product.updatedAt', 'DESC')
        .getMany();
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        arrival: p.arrival,
        status: p.status,
        productStocks:
          p.productStocks &&
          p.productStocks.map((e) => ({ size: e.size, amount: e.amount })),
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createProduct(createProductdto: CreateProductDto) {
    try {
      const { name, price, arrival, status } = createProductdto;
      const subCategory = await this.subCategoryRepository.findOne(
        createProductdto.subCategoryId,
      );
      if (!subCategory) return false;

      const product = new Product(subCategory, name, price, arrival, status);
      product.productStocks = [];
      for (const _stock of createProductdto.productStocks) {
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

  async updateProduct(productId, createProductdto: CreateProductDto) {
    try {
      const product = await this.productRepository.findOne(productId);
      if (!product) return false;

      const { name, price, arrival, status } = createProductdto;
      const subCategory = await this.subCategoryRepository.findOne(
        createProductdto.subCategoryId,
      );
      if (!subCategory) return false;
      product.name = name;
      product.price = price;
      product.arrival = arrival;
      product.status = status;
      product.productStocks = [];
      for (const _stock of createProductdto.productStocks) {
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
}
