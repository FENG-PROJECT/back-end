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
import { OrderService } from './order.service';
import { ValidUploadFileType } from 'src/utils/constant';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    let result = null;

    try {
      // result = await this.orderService.getProfile(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
