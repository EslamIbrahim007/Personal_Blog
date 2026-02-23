import { Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { TokenService } from './services/token.service';
import { MailService } from './mail/mail.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    private readonly tokenService;
    private readonly mailService;
    private readonly dataSource;
    private readonly userRepository;
    private readonly userSessionRepository;
    private readonly emailVerificationTokenRepository;
    private readonly passwordResetTokenRepository;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, logger: Logger, tokenService: TokenService, mailService: MailService, dataSource: DataSource, userRepository: Repository<User>, userSessionRepository: Repository<UserSession>, emailVerificationTokenRepository: Repository<EmailVerificationToken>, passwordResetTokenRepository: Repository<PasswordResetToken>);
    register(registerDto: RegisterDto): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    private extractRolesAndPermissions;
    login(LoginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshExpiresAt: Date;
        user: {
            id: string;
            email: string;
            roles: string[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        newRefreshToken: string;
        newRefreshExpiresAt: Date;
    }>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
