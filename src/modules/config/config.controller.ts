import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  BadRequestException,
  InternalServerErrorException,
} from 'src/exceptions';
import { ConfigService } from './config.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateConfigDto } from './dto';

@Controller('configs')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createConfig(
    @Body() createConfigDto: CreateConfigDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file && !(file?.mimetype in ValidUploadFileType))
      throw new BadRequestException();

    let result = null;
    createConfigDto.image = file?.filename;
    try {
      result = await this.configService.createConfig(createConfigDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new BadGatewayException();

    return result;
  }

  @Get()
  async getConfig() {
    let result = null;

    try {
      result = await this.configService.getConfig();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return result;
  }
}
