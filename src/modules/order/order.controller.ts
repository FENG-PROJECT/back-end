import {
  Body,
  Controller,
  Get,
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
import { OrderService } from './order.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateOrderDto } from './dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders() {
    let result = null;

    try {
      result = await this.orderService.getOrders();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!result) throw new BadRequestException();

    return result;
  }

  @Post()
  async getProfile(@Body() createOrder: CreateOrderDto) {
    let result = null;

    try {
      result = await this.orderService.createOrder(createOrder);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
