import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { UpdateBuyerDto } from './dto';
import { Buyer } from './entity';

@Injectable()
export class BuyerService {
  private readonly logger = new Logger(BuyerService.name);

  constructor(
    @Inject('BUYER_REPOSITORY')
    private buyerRepository: Repository<Buyer>,
  ) {}

  async findOne(email: string): Promise<Buyer | undefined> {
    try {
      return await this.buyerRepository.findOne({ email: email });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProfile(user) {
    try {
      const buyer = await this.buyerRepository.findOne({ id: user.id });
      if (!buyer) return false;

      return {
        username: buyer.username,
        address: buyer.address,
        email: buyer.email,
        companyDescription: buyer.companyDescription,
        avatar: buyer.avatar && `${process.env.URL}/avatar/${buyer.avatar}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(buyerId: number, updateBuyerDto: UpdateBuyerDto) {
    try {
      const buyer = await this.buyerRepository.findOne({ id: buyerId });

      if (!buyer) return false;

      const checkUsername = await this.buyerRepository.findOne({
        username: updateBuyerDto.username,
        id: Not(buyer.id),
      });
      if (checkUsername) return false;

      buyer.address = updateBuyerDto.address;
      buyer.username = updateBuyerDto.username;
      buyer.companyDescription = updateBuyerDto.companyDescription;
      buyer.avatar = updateBuyerDto.avatar;

      await this.buyerRepository.save(buyer);

      return {
        username: buyer.username,
        address: buyer.address,
        companyDescription: buyer.companyDescription,
        avatar: buyer.avatar && `${process.env.URL}/avatar/${buyer.avatar}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
