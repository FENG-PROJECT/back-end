import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto';
import { Event } from './entity';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @Inject('EVENT_REPOSITORY')
    private eventRepository: Repository<Event>,
  ) {}

  async getEvent() {
    try {
      let event = await this.eventRepository.findOne();
      if (!event) return false;
      return event;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOrUpdateEvent(createEventDto: CreateEventDto) {
    try {
      let event = await this.eventRepository.findOne();

      if (!event) {
        event = new Event(createEventDto.content, createEventDto.link);
      }
      event.content = createEventDto.content;
      event.link = createEventDto.link;

      await this.eventRepository.save(event);
      return {
        message: 'success',
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteEvent() {
    try {
      await this.eventRepository.delete({});
      return {
        message: 'success',
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
