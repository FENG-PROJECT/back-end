import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subcribe } from './entity';

@Injectable()
export class SubcribeService {
  private readonly logger = new Logger(SubcribeService.name);

  constructor(
    @Inject('SUBCRIBE_REPOSITORY')
    private subcribeRepository: Repository<Subcribe>,
  ) {}

  async getSubcribes(limit: number, offset: number) {
    try {
      let countQuery = this.subcribeRepository.createQueryBuilder('subcribe');

      let query = this.subcribeRepository.createQueryBuilder('subcribe');

      const [countSubcribes, subcribes] = await Promise.all([
        countQuery.getCount(),
        query
          .orderBy('subcribe.updatedAt', 'DESC')
          .take(limit || 10)
          .skip(offset || 0)
          .getMany(),
      ]);
      return {
        count: countSubcribes,
        subcribes: subcribes.map((s) => ({
          email: s.email,
        })),
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createSubcribe(createSubcribeDto: { email: string }) {
    try {
      let subcribe = await this.subcribeRepository.findOne({
        email: createSubcribeDto.email,
      });
      if (!subcribe) subcribe = new Subcribe(createSubcribeDto.email);
      subcribe.email = createSubcribeDto.email;

      await this.subcribeRepository.save(subcribe);
      return {
        message: 'success',
        data: {
          email: subcribe.email,
        },
      };
    } catch (error) {
      console.log(error, 'error');
      this.logger.error(error);
      throw error;
    }
  }
}
