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
import { CreateCollectionDto } from './dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  async getCollection() {
    let result = null;

    try {
      result = await this.collectionService.getCollection();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Post()
  async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    let result = null;

    try {
      result = await this.collectionService.createCollection(
        createCollectionDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Put(':collectionId')
  async updateCollection(
    @Param('collectionId') collectionId: string,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    let result = null;

    try {
      result = await this.collectionService.updateCollection(
        +collectionId,
        createCollectionDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
