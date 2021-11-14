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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { BuyerService } from './buyer.service';
import { ValidUploadFileType } from 'src/utils/constant';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    let result = null;

    try {
      result = await this.buyerService.getProfile(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put('profile')
  async updateProfile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBuyerDto: UpdateBuyerDto,
  ) {
    if (file && !(file?.mimetype in ValidUploadFileType))
      throw new BadRequestException();

    if (file) updateBuyerDto.avatar = file.filename;

    if (updateBuyerDto?.address) throw new BadRequestException();

    let result = null;

    try {
      result = await this.buyerService.updateProfile(
        req.user.id,
        updateBuyerDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
