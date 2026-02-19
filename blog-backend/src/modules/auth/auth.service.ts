import {
    Injectable, UnauthorizedException, Logger,
    ForbiddenException,
    NotFoundException
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { JwtAccessPayload } from './types/jwt-payload.type';
import { TokenService } from './services/token.service';
import { MailService } from './mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly dataSource: DataSource,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(UserSession) private readonly userSessionRepository: Repository<UserSession>,
        @InjectRepository(EmailVerificationToken) private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
        @InjectRepository(PasswordResetToken) private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
    ) { }

    async register(registerDto: RegisterDto): Promise<void> {
        //1. register user
        const user = await this.usersService.create(registerDto);
        //2. generate verification token
        const { token, expiresAt } = await this.tokenService.generateEmailVerificationToken(24 * 60); //24 hours
        const tokenHash = this.tokenService.hashToken(token); //hash token
        //3. save verification token
        await this.emailVerificationTokenRepository.save({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        // send email via MailService
        await this.mailService.sendVerifyEmail(user.email, token);
    };

    async verifyEmail(token: string) {
        //1.hash token
        const tokenHash = this.tokenService.hashToken(token);
        //2.find record
        const record = await this.emailVerificationTokenRepository.findOne({
            where: {
                tokenHash,
                expiresAt: MoreThan(new Date()),
                usedAt: IsNull(),
            }
        });
        if (!record) {
            throw new UnauthorizedException('Invalid token');
        }
        //3.verify email
        await this.userRepository.update(
            { id: record.userId },
            { emailVerifiedAt: new Date() },
        );
        //4.mark token as used
        await this.emailVerificationTokenRepository.update(
            { id: record.id },
            { usedAt: new Date() },
        );
    };

    private extractRolesAndPermissions(user: User): { roles: string[]; permissions: string[] } {
        const roles = new Set<string>();
        const permissions = new Set<string>();

        for (const ur of user.userRoles ?? []) {
            if (ur.role?.name) roles.add(ur.role.name);
            for (const rp of ur.role?.rolePermissions ?? []) {
                if (rp.permission?.name) permissions.add(rp.permission.name);
            }
        }

        return { roles: [...roles], permissions: [...permissions] };
    }

    async login(LoginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        refreshExpiresAt: Date;
        user: { id: string; email: string; roles: string[] };
    }> {
        //1.check if user Email
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        //2.check if user is active
        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //3.check if user is verified
        if (!user.emailVerifiedAt) {
            throw new UnauthorizedException('User not verified');
        }
        //4.check if password is valid
        const isPasswordValid = await argon2.verify(user.password, LoginDto.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }
        //5. extract roles and permissions
        const { roles, permissions } = this.extractRolesAndPermissions(user);
        //6. create payload
        const payload: JwtAccessPayload = {
            sub: user.id,
            roles,
            permissions,
        };
        //7. generate tokens
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const { token: refreshToken, expiresAt: refreshExpiresAt } = await this.tokenService.generateRefreshToken(30);
        const refreshTokenHash = this.tokenService.hashToken(refreshToken);
        //8. save refresh token
        await this.userSessionRepository.save({
            userId: user.id,
            refreshTokenHash,
            expiresAt: refreshExpiresAt,
            ip: null,
            userAgent: null,
        });
        //9. return tokens
        return {
            accessToken,
            refreshToken,
            refreshExpiresAt,
            user: { id: user.id, email: user.email, roles },
        };
    };

    //verifyUserRefreshToken
    async refresh(refreshToken: string): Promise<{
        accessToken: string;
        newRefreshToken: string;
        newRefreshExpiresAt: Date;
    }> {
        //1.hash token
        const refreshTokenHash = this.tokenService.hashToken(refreshToken);
        //2.find record
        const session = await this.userSessionRepository.findOne({
            where: {
                refreshTokenHash,
                revokedAt: IsNull(),
                expiresAt: MoreThan(new Date()),
            },
            relations: ['user'],
        });
        if (!session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        //3.revoke old refresh token
        await this.userSessionRepository.update(session.id, {
            revokedAt: new Date(),
        });
        //4. load user roles and permissions
        const fullUser = await this.userRepository.findOne({
            where: { id: session.userId },
            relations: {
                userRoles: {
                    role: {
                        rolePermissions: {
                            permission: true,
                        },
                    },
                },
            },
        });
        if (!fullUser || !fullUser.isActive) {
            throw new UnauthorizedException('User not found or inactive');
        }
        //4.1 extract roles and permissions
        const { roles, permissions } = this.extractRolesAndPermissions(fullUser);
        //5. create payload
        const payload: JwtAccessPayload = {
            sub: session.user.id,
            roles,
            permissions,
        };
        //6. generate new tokens
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const { token: newRefreshToken, expiresAt: newRefreshExpiresAt } = await this.tokenService.generateRefreshToken(30);
        const newRefreshTokenHash = this.tokenService.hashToken(newRefreshToken);
        //7.save new refresh token
        await this.userSessionRepository.save({
            userId: fullUser.id,
            refreshTokenHash: newRefreshTokenHash,
            expiresAt: newRefreshExpiresAt,
            ip: null,
            userAgent: null,
        });
        //8.return tokens
        return {
            accessToken,
            newRefreshToken,
            newRefreshExpiresAt,
        };

    }

    // forgot password
    async forgotPassword(email: string) {
        //1.check if user exists
        const user = await this.usersService.findOneByEmail(email);
        if (!user) return;
        //2.generate token
        const { token, expiresAt } = await this.tokenService.generateEmailVerificationToken(60);
        const hashedToken = this.tokenService.hashToken(token);
        //3.save token
        await this.passwordResetTokenRepository.save({
            userId: user.id,
            tokenHash: hashedToken,
            expiresAt: expiresAt,
            usedAt: null,
        });
        // send email via MailService
        await this.mailService.sendResetPassword(user.email, token);
    }

    // reset password
    async resetPassword(token: string, newPassword: string): Promise<void> {
        //1.hash token
        const tokenHash = this.tokenService.hashToken(token);
        //2.Transaction
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            //2.find record
            const record = await queryRunner.manager.findOne(PasswordResetToken, {
                where: {
                    tokenHash,
                    expiresAt: MoreThan(new Date()),
                    usedAt: IsNull(),
                }
            });
            if (!record) {
                throw new UnauthorizedException('Invalid token');
            }
            //3.hash new password
            const newPasswordHash = await argon2.hash(newPassword);
            //4.update user password
            await queryRunner.manager.update(User, { id: record.userId }, { password: newPasswordHash });
            //5.mark token as used
            await queryRunner.manager.update(PasswordResetToken, { id: record.id }, { usedAt: new Date() });
            //6.revoke all other refresh tokens for this user
            await queryRunner.manager.update(UserSession, { userId: record.userId, revokedAt: IsNull() }, { revokedAt: new Date() });
            //7.commit transaction
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
