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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { OrderService } from './order.service';
import { OrderStatus, ValidUploadFileType } from 'src/utils/constant';
import { CreateOrderDto } from './dto';
import { UpdateStatusOrderDto } from './dto/updateStatusOrder.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(
    @Query('orderStatus') orderStatus: OrderStatus,
    @Query('search') search: string,
  ) {
    let result = null;

    try {
      result = await this.orderService.getOrders(orderStatus, search);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!result) throw new BadRequestException();

    return result;
  }

  @Get('/email/:email')
  async getOrderByEmail(@Param('email') email: string) {
    let result = null;

    try {
      result = await this.orderService.getOrderByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!result) throw new BadRequestException();

    return result;
  }

  @Post()
  async createOrder(@Body() createOrder: CreateOrderDto) {
    let result = null;

    try {
      result = await this.orderService.createOrder(createOrder);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new BadRequestException();

    return result;
  }

  @Put(':orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateStatusOrder: UpdateStatusOrderDto,
  ) {
    let result = null;

    try {
      result = await this.orderService.updateOrder(+orderId, updateStatusOrder);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
