import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { ConfigController } from './config.controller';
import { ConfigProviders } from './config.providers';
import { ConfigService } from './config.service';
import { diskStorage } from 'multer';
import path = require('path');
import { CategoryProviders } from '../category/category.providers';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: './uploads/splashScreen',
          filename: (req, file, cb) => {
            const filename: string =
              path.parse(file.originalname).name.replace(/\s/g, '') +
              Date.now();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
          },
        }),
      }),
    }),
  ],
  controllers: [ConfigController],
  providers: [...ConfigProviders, ...CategoryProviders, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
