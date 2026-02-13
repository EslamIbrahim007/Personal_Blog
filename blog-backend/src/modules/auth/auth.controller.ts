import { Controller, UseGuards, Post, Res, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../Guard/local-auth.guard';
import { Response } from 'express';
import { CurrentUser } from '../../Decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtRefreshAuthGuard } from 'src/Guard/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@CurrentUser() user: User, @Res() res: Response) {
    this.authService.login(user);

  }

  @Post('logout')
  async logout(@CurrentUser() user: User, @Res() res: Response) {
    this.authService.logout(user.email);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(@CurrentUser() user: User, @Res() res: Response) {
    this.authService.login(user);
  }
}
