import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { AdminService } from './admin.service';
import { ValidUploadFileType } from 'src/utils/constant';
import { CreateAdminDto } from './dto';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    let result = null;

    try {
      result = await this.adminService.getProfile(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }

  @Post()
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    let result = null;

    try {
      result = await this.adminService.createAdmin(createAdminDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return result;
  }
}
