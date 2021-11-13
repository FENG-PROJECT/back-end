import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateBuyerDto } from '../buyer/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { ProductService } from './product.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateProductDto } from './dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    let result = null;

    try {
      result = await this.productService.createProduct(createProductDto);
    } catch (error) {}

    if (!result) throw new NotFoundException();

    return result;
  }

  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    let result = null;

    try {
      result = await this.productService.updateProduct(
        +productId,
        createProductDto,
      );
    } catch (error) {}

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get()
  async getProductBySubCategoryId(
    @Query('subCategoryId') subCategoryId: string,
  ) {
    let result = null;

    try {
      result = await this.productService.getProductBySubCategoryId(
        +subCategoryId,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
