import { Controller, UseGuards, Post, Res, Body, HttpCode, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../Guard/local-auth.guard';
import { Response, CookieOptions, Request } from 'express';
import { CurrentUser } from '../../Decorator/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtRefreshAuthGuard } from 'src/Guard/jwt-refresh-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private setRefreshCookie(res: Response, token: string, expiresAt: Date) {
    const isProd = process.env.NODE_ENV === 'production';

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/auth/refresh', // ✅ as agreed
      expires: expiresAt,
    };
    res.cookie('refreshToken', token, cookieOptions);
  }

  private clearRefreshCookie(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/auth/refresh',
    });
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    await this.authService.register(dto);
    return { message: 'Registered. Please verify your email.' };
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.token);
    return { message: 'Email verified.' };
  }
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    // put refresh in cookie, access in body
    this.setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      // AuthService will throw Unauthorized anyway, but keep this explicit
      return { message: 'Missing refresh token' };
    }

    const { accessToken, newRefreshToken, newRefreshExpiresAt } =
      await this.authService.refresh(refreshToken);

    this.setRefreshCookie(res, newRefreshToken, newRefreshExpiresAt);

    return { accessToken };

  }
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If the email exists, we sent a reset link.' };
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password updated.' };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    // We'll add session revoke logic later (based on refresh token hash).
    this.clearRefreshCookie(res);
    return { message: 'Logged out.' };
  }
}
