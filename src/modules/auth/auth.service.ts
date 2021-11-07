import { Inject, Injectable } from '@nestjs/common';
import { BuyerService } from '../buyer/buyer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { CreateBuyerDto } from '../buyer/dto';
import { Buyer } from '../buyer/entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly buyerService: BuyerService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject('BUYER_REPOSITORY')
    private buyerRepository: Repository<Buyer>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.buyerService.findOne(email);
      if (!user) return false;

      if (!user.isActive) {
        throw new BadRequestException();
      }

      if (!bcrypt.compareSync(password, user?.password)) {
        throw new BadRequestException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email, id: user.id };
      return this.jwtService.sign(payload);
    } catch (error) {
      return null;
    }
  }

  async register(createBuyerDto: CreateBuyerDto): Promise<any> {
    try {
      const checkEmail = await this.buyerRepository.findOne({
        email: createBuyerDto.email,
      });
      if (checkEmail) return false;

      const checkUsername = await this.buyerRepository.findOne({
        username: createBuyerDto.username,
      });
      if (checkUsername) return false;

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(createBuyerDto.password, salt);

      const buyer = new Buyer(
        createBuyerDto.email,
        password,
        createBuyerDto.username,
      );
      await this.buyerRepository.save(buyer);

      const message = Buffer.from(`${Date.now()}:${buyer.id}`).toString(
        'base64',
      );

      this.mailService.sendMail(
        buyer.email,
        'Account Confirmation',
        'confirmation',
        {
          email: buyer.email,
          url: `${process.env.URL}/api/auth/confirmMail/${message}`,
        },
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async confirmMail(message: string) {
    try {
      const decodeMessage = Buffer.from(message, 'base64').toString('binary');
      const [timestamp, id] = decodeMessage.split(':');
      if (!id || !timestamp || isNaN(+id)) return false;

      const buyer = await this.buyerRepository.findOne({ id: +id });
      if (!buyer) return false;

      if (buyer.isActive) return true;

      buyer.isActive = true;
      await this.buyerRepository.save(buyer);

      this.mailService.sendMail(
        buyer.email,
        'Welcome to DataBank Application',
        'welcome',
        {
          email: buyer.email,
          linkLogin: `${process.env.URL_FRONTEND}/login/buyer`,
        },
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(buyerId, changePasswordDto: ChangePasswordDto) {
    try {
      const buyer = await this.buyerRepository.findOne({ id: buyerId });

      if (
        !buyer ||
        !buyer.isActive ||
        !bcrypt.compareSync(changePasswordDto.oldPassword, buyer?.password)
      )
        return false;

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(changePasswordDto.newPassword, salt);

      buyer.password = password;
      await this.buyerRepository.save(buyer);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async changeEmail(buyerId, newEmail: string): Promise<any> {
    try {
      await this.buyerRepository.update(
        { id: buyerId },
        { emailRecovery: newEmail },
      );

      const message = Buffer.from(`${Date.now()}:${buyerId}`).toString(
        'base64',
      );

      this.mailService.sendMail(
        newEmail,
        'Change Email Confirmation',
        'changeEmailConfirm',
        {
          email: newEmail,
          url: `${process.env.URL}/api/auth/changeEmailConfirm/${message}`,
        },
      );
      return true;
    } catch (error) {
      throw error;
    }
  }

  async changeEmailConfirm(message: string) {
    try {
      const decodeMessage = Buffer.from(message, 'base64').toString('binary');
      const [timestamp, id] = decodeMessage.split(':');
      if (!id || !timestamp || isNaN(+id)) return false;

      const buyer = await this.buyerRepository.findOne({ id: +id });
      if (!buyer || !buyer.emailRecovery) return false;

      await this.buyerRepository.update(
        { email: buyer.emailRecovery },
        { isActive: false },
      );

      buyer.email = buyer.emailRecovery;
      buyer.isActive = true;
      await this.buyerRepository.save(buyer);

      this.mailService.sendMail(
        buyer.email,
        'Change Email Successfully',
        'welcome',
        {
          email: buyer.email,
          linkLogin: `${process.env.URL_FRONTEND}/login/buyer`,
        },
      );
      return true;
    } catch (error) {
      throw error;
    }
  }
}
