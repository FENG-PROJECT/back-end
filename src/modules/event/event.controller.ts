import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from 'src/exceptions';
import { EventService } from './event.service';
import { CreateEventDto } from './dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvent() {
    let result = null;

    try {
      result = await this.eventService.getEvent();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    return {
      content: result.content,
      link: result.link,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrUpdateEvent(@Body() createEventDto: CreateEventDto) {
    let result = null;

    try {
      result = await this.eventService.createOrUpdateEvent(createEventDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteEvent() {
    let result = null;

    try {
      result = await this.eventService.deleteEvent();
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
