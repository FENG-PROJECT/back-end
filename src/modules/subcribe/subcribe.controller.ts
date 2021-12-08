import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from 'src/exceptions';
import { SubcribeService } from './subcribe.service';

@Controller('subcribes')
export class SubcribeController {
  constructor(private readonly subcribeService: SubcribeService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSubcribe(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    let result = null;

    try {
      result = await this.subcribeService.getSubcribes(
        Number(limit),
        Number(offset),
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Post()
  async createSubcribe(@Body() createSubcribeDto: { email: string }) {
    let result = null;

    try {
      result = await this.subcribeService.createSubcribe(createSubcribeDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
