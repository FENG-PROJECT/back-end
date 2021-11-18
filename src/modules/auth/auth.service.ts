import { Inject, Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { Admin } from '../admin/entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<Admin>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.adminService.findOne(email);
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

  async changePassword(buyerId, changePasswordDto: ChangePasswordDto) {
    try {
      const buyer = await this.adminRepository.findOne({ id: buyerId });

      if (
        !buyer ||
        !buyer.isActive ||
        !bcrypt.compareSync(changePasswordDto.oldPassword, buyer?.password)
      )
        return false;

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(changePasswordDto.newPassword, salt);

      buyer.password = password;
      await this.adminRepository.save(buyer);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
