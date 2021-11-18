import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from '../database/database.module';
import { AdminController } from './admin.controller';
import { AdminProviders } from './admin.providers';
import { AdminService } from './admin.service';
import { diskStorage } from 'multer';
import path = require('path');

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useFactory: async () => ({
        storage: diskStorage({
          destination: './uploads/avatar',
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
  controllers: [AdminController],
  providers: [...AdminProviders, AdminService],
  exports: [AdminService],
})
export class AdminModule {}
