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
import { CreateBuyerDto } from '../buyer/dto';
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

  @Post('register')
  async register(@Body() createBuyerDto: CreateBuyerDto) {
    let result = null;

    try {
      result = await this.authService.register(createBuyerDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) throw new NotFoundException();
    return { status: result ? 'SUCCESS' : 'FAILED', success: result };
  }

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

  @Get('confirmMail/:message')
  async confirmMail(@Res() res, @Param('message') message: string) {
    let result = null;

    try {
      result = await this.authService.confirmMail(message);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) return res.redirect(`${process.env.URL_FRONTEND}/notfound`);

    return res.redirect(`${process.env.URL_FRONTEND}/login/buyer`);
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

  @UseGuards(JwtAuthGuard)
  @Put('changeEmail')
  async changeEmail(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    let result = null;

    try {
      result = await this.authService.changeEmail(
        +req.user.id,
        changeEmailDto.newEmail,
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
    if (!result) throw new NotFoundException();

    return { status: result ? 'SUCCESS' : 'FAILED', success: result };
  }

  @Get('changeEmailConfirm/:message')
  async changeEmailConfirm(@Res() res, @Param('message') message: string) {
    let result = null;

    try {
      result = await this.authService.changeEmailConfirm(message);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    if (!result) return res.redirect(`${process.env.URL_FRONTEND}/notfound`);

    return res.redirect(`${process.env.URL_FRONTEND}/login/buyer`);
  }
}
