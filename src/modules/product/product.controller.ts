import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from 'src/exceptions';
import { ProductService } from './product.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateProductDto } from './dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() uploads: Array<Express.Multer.File>,
  ) {
    for (const file of uploads?.['files'] || []) {
      if (file && !(file?.mimetype in ValidUploadFileType))
        throw new BadRequestException();
    }

    let result = null;

    try {
      result = await this.productService.createProduct(
        createProductDto,
        uploads?.['files']?.map((e) => e.filename) || [],
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':productId')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 7 }]))
  async updateProduct(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() uploads: Array<Express.Multer.File>,
  ) {
    for (const file of uploads?.['files'] || []) {
      if (file && !(file?.mimetype in ValidUploadFileType))
        throw new BadRequestException();
    }

    let result = null;

    try {
      result = await this.productService.updateProduct(
        +productId,
        createProductDto,
        uploads?.['files']?.map((e) => e.filename) || [],
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get()
  async getProducts(
    @Query('category') category: string,
    @Query('subCategoryUrl') subCategoryUrl: string,
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    let result = null;

    try {
      result = await this.productService.getProducts(
        category,
        subCategoryUrl,
        search,
        +limit || 10,
        +offset || 0,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get(':productId')
  async getProductDetail(@Param('productId') productId: string) {
    let result = null;

    try {
      result = await this.productService.getProductDetail(+productId);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    let result = null;

    try {
      result = await this.productService.deleteProduct(+productId);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
