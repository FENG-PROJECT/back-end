import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { CategoryService } from './category.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateSubCategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories() {
    let result = null;

    try {
      result = await this.categoryService.getCategories();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Get(':nameCategory')
  async getSubCategoriesByCategoryName(
    @Param('nameCategory') nameCategory: string,
  ) {
    let result = null;

    try {
      result = await this.categoryService.getSubCategoriesByCategoryName(
        nameCategory,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/subCategory')
  async createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    let result = null;

    try {
      result = await this.categoryService.createSubCategory(
        createSubCategoryDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/subCategory/:subCategoryId')
  async updateSubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    let result = null;

    try {
      result = await this.categoryService.updateSubCategory(
        +subCategoryId,
        createSubCategoryDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
