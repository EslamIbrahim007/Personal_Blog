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
const user_entity_1 = require("../users/entities/user.entity");
const bcrypt = require("bcrypt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, userRepository, logger) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async register(createUserDto) {
        const user = await this.usersService.findOneByEmail(createUserDto.email);
        if (user) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const createdUser = await this.usersService.create(createUserDto);
        const payload = { email: createdUser.email, sub: createdUser.id, role: createdUser.role };
        createdUser.password = await bcrypt.hash(createdUser.password, 10);
        await this.userRepository.save(createdUser);
        return {
            access_token: this.jwtService.sign(payload),
            user: createdUser,
        };
    }
    ;
    async login(LoginDto) {
        const expirationMs = this.configService.get('JWT_EXPIRATION_MS');
        const expirationDate = new Date(Date.now() + expirationMs);
        const refreshExpirationMs = this.configService.get('JWT_REFRESH_EXPIRATION_MS');
        const refreshExpirationDate = new Date(Date.now() + refreshExpirationMs);
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(LoginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('JWT_EXPIRATION_MS') });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_MS') });
        user.refreshToken = refreshToken;
        await this.userRepository.save(user);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user,
        };
    }
    ;
    async verifyUser(LoginDto) {
        const user = await this.usersService.findOneByEmail(LoginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(LoginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        return user;
    }
    async verifyUserRefreshToken(refreshToken, email) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        return user;
    }
    async logout(email) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        user.refreshToken = null;
        this.logger.log(`User ${user.email} logged out`);
        await this.userRepository.save(user);
        return {
            message: 'User logged out successfully',
        };
    }
    async refreshToken(refreshToken) {
        const user = await this.usersService.findOneByEmail(refreshToken);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository,
        common_1.Logger])
], AuthService);
//# sourceMappingURL=auth.service.js.map