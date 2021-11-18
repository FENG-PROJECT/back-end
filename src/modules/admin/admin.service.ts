import { Inject, Injectable, Logger } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { CreateAdminDto } from './dto';
import { Admin } from './entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @Inject('ADMIN_REPOSITORY')
    private adminRepository: Repository<Admin>,
  ) {}

  async findOne(email: string): Promise<Admin | undefined> {
    try {
      return await this.adminRepository.findOne({ email: email });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProfile(user) {
    try {
      const admin = await this.adminRepository.findOne({ id: user.id });
      if (!admin) return false;

      return {
        username: admin.username,
        email: admin.email,
        avatar: admin.avatar && `${process.env.URL}/avatar/${admin.avatar}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<any> {
    try {
      const checkEmail = await this.adminRepository.findOne({
        email: createAdminDto.email,
      });
      if (checkEmail) return false;

      const checkUsername = await this.adminRepository.findOne({
        username: createAdminDto.username,
      });
      if (checkUsername) return false;

      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(createAdminDto.password, salt);

      const admin = new Admin(
        createAdminDto.email,
        password,
        createAdminDto.username,
      );
      await this.adminRepository.save(admin);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
