import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { CreateConfigDto } from './dto';
import { Config } from './entity';
import * as fs from 'fs';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(
    @Inject('CONFIG_REPOSITORY')
    private configRepository: Repository<Config>,
  ) {}

  async createConfig(createConfigDto: CreateConfigDto) {
    try {
      let config = await this.configRepository.findOne();
      if (!config) config = new Config();

      if (fs.existsSync(`uploads/splashScreen/${config.image}`))
        fs.unlinkSync(`uploads/splashScreen/${config.image}`);

      config.customerCare = createConfigDto.customerCare;
      config.aboutUs = createConfigDto.aboutUs;
      config.contact = createConfigDto.contact;
      config.title = createConfigDto.title;
      config.description = createConfigDto.description;
      config.image = createConfigDto.image;

      await this.configRepository.save(config);
      return {
        customerCare: config.customerCare,
        aboutUs: config.aboutUs,
        contact: config.contact,
        title: config.title,
        description: config.description,
        image: config.image
          ? `${process.env.URL}/splashScreen/${config.image}`
          : null,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getConfig() {
    try {
      const config = await this.configRepository.findOne();

      return {
        customerCare: config?.customerCare || null,
        aboutUs: config?.aboutUs || null,
        contact: config?.contact || null,
        title: config?.title || null,
        description: config?.description || null,
        image:
          (config?.image &&
            `${process.env.URL}/splashScreen/${config?.image}`) ||
          null,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
