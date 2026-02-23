"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
const user_session_entity_1 = require("./entities/user-session.entity");
const email_verification_token_entity_1 = require("./entities/email-verification-token.entity");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const token_service_1 = require("./services/token.service");
const mail_service_1 = require("./mail/mail.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, logger, tokenService, mailService, dataSource, userRepository, userSessionRepository, emailVerificationTokenRepository, passwordResetTokenRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
        this.tokenService = tokenService;
        this.mailService = mailService;
        this.dataSource = dataSource;
        this.userRepository = userRepository;
        this.userSessionRepository = userSessionRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }
    async register(registerDto) {
        const user = await this.usersService.create(registerDto);
        const { token, expiresAt } = await this.tokenService.generateEmailVerificationToken(24 * 60);
        const tokenHash = this.tokenService.hashToken(token);
        await this.emailVerificationTokenRepository.save({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        this.mailService.sendVerifyEmail(user.email, token).catch(err => {
            this.logger.error(`Failed to send verification email to ${user.email}: ${err.message}`);
        });
    }
    ;
    async verifyEmail(token) {
        const tokenHash = this.tokenService.hashToken(token);
        const record = await this.emailVerificationTokenRepository.findOne({
            where: {
                tokenHash,
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
                usedAt: (0, typeorm_2.IsNull)(),
            }
        });
        if (!record) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        await this.userRepository.update({ id: record.userId }, { emailVerifiedAt: new Date() });
        await this.emailVerificationTokenRepository.update({ id: record.id }, { usedAt: new Date() });
    }
    ;
    extractRolesAndPermissions(user) {
        const roles = new Set();
        const permissions = new Set();
        for (const ur of user.userRoles ?? []) {
            if (ur.role?.name)
                roles.add(ur.role.name);
            for (const rp of ur.role?.rolePermissions ?? []) {
                if (rp.permission?.name)
                    permissions.add(rp.permission.name);
            }
        }
        return { roles: [...roles], permissions: [...permissions] };
    }
    async login(LoginDto) {
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.emailVerifiedAt) {
            throw new common_1.UnauthorizedException('User not verified');
        }
        const isPasswordValid = await argon2.verify(user.password, LoginDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const { roles, permissions } = this.extractRolesAndPermissions(user);
        const payload = {
            sub: user.id,
            roles,
            permissions,
        };
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const { token: refreshToken, expiresAt: refreshExpiresAt } = await this.tokenService.generateRefreshToken(30);
        const refreshTokenHash = this.tokenService.hashToken(refreshToken);
        await this.userSessionRepository.save({
            userId: user.id,
            refreshTokenHash,
            expiresAt: refreshExpiresAt,
            ip: null,
            userAgent: null,
        });
        return {
            accessToken,
            refreshToken,
            refreshExpiresAt,
            user: { id: user.id, email: user.email, roles },
        };
    }
    ;
    async refresh(refreshToken) {
        const refreshTokenHash = this.tokenService.hashToken(refreshToken);
        const session = await this.userSessionRepository.findOne({
            where: {
                refreshTokenHash,
                revokedAt: (0, typeorm_2.IsNull)(),
                expiresAt: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: ['user'],
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.userSessionRepository.update(session.id, {
            revokedAt: new Date(),
        });
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
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const { roles, permissions } = this.extractRolesAndPermissions(fullUser);
        const payload = {
            sub: session.user.id,
            roles,
            permissions,
        };
        const accessToken = await this.tokenService.generateAccessToken(payload);
        const { token: newRefreshToken, expiresAt: newRefreshExpiresAt } = await this.tokenService.generateRefreshToken(30);
        const newRefreshTokenHash = this.tokenService.hashToken(newRefreshToken);
        await this.userSessionRepository.save({
            userId: fullUser.id,
            refreshTokenHash: newRefreshTokenHash,
            expiresAt: newRefreshExpiresAt,
            ip: null,
            userAgent: null,
        });
        return {
            accessToken,
            newRefreshToken,
            newRefreshExpiresAt,
        };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user)
            return;
        const { token, expiresAt } = await this.tokenService.generateEmailVerificationToken(60);
        const hashedToken = this.tokenService.hashToken(token);
        await this.passwordResetTokenRepository.save({
            userId: user.id,
            tokenHash: hashedToken,
            expiresAt: expiresAt,
            usedAt: null,
        });
        await this.mailService.sendResetPassword(user.email, token);
    }
    async resetPassword(token, newPassword) {
        const tokenHash = this.tokenService.hashToken(token);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const record = await queryRunner.manager.findOne(password_reset_token_entity_1.PasswordResetToken, {
                where: {
                    tokenHash,
                    expiresAt: (0, typeorm_2.MoreThan)(new Date()),
                    usedAt: (0, typeorm_2.IsNull)(),
                }
            });
            if (!record) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const newPasswordHash = await argon2.hash(newPassword);
            await queryRunner.manager.update(user_entity_1.User, { id: record.userId }, { password: newPasswordHash });
            await queryRunner.manager.update(password_reset_token_entity_1.PasswordResetToken, { id: record.id }, { usedAt: new Date() });
            await queryRunner.manager.update(user_session_entity_1.UserSession, { userId: record.userId, revokedAt: (0, typeorm_2.IsNull)() }, { revokedAt: new Date() });
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(7, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(8, (0, typeorm_1.InjectRepository)(user_session_entity_1.UserSession)),
    __param(9, (0, typeorm_1.InjectRepository)(email_verification_token_entity_1.EmailVerificationToken)),
    __param(10, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        common_1.Logger,
        token_service_1.TokenService,
        mail_service_1.MailService,
        typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map