import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubcribeController } from './subcribe.controller';
import { SubcribeProviders } from './subcribe.providers';
import { SubcribeService } from './subcribe.service';
import { CategoryProviders } from '../category/category.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SubcribeController],
  providers: [...SubcribeProviders, SubcribeService],
})
export class SubcribeModule {}
