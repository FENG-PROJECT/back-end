import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from 'src/exceptions';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangeEmailDto } from './dto/changeEmail.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    let result = null;

    try {
      result = await this.authService.login(req.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();

    return {
      status: result ? 'SUCCESS' : 'FAILED',
      success: !!result,
      accessToken: result,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('changePassword')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    let result = null;

    try {
      result = await this.authService.changePassword(
        +req.user.id,
        changePasswordDto,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException();

    return { status: result ? 'SUCCESS' : 'FAILED', success: result };
  }
}
