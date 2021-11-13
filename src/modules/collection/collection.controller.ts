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
import { CollectionService } from './collection.service';
import { ValidUploadFileType } from 'src/utils/constant';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    let result = null;

    try {
      // result = await this.collectionService.getProfile(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
