import {
  Body,
  Controller,
  Get,
  Put,
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

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    let result = null;

    try {
      // result = await this.buyerService.getProfile(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
