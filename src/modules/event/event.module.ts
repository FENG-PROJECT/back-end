import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventController } from './event.controller';
import { EventProviders } from './event.providers';
import { EventService } from './event.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EventController],
  providers: [...EventProviders, EventService],
  exports: [EventService],
})
export class EventModule {}
