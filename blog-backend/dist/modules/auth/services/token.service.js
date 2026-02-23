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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
let TokenService = class TokenService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateAccessToken(payload) {
        return this.jwtService.sign(payload);
    }
    async generateRefreshToken(dayToExpire = 30) {
        const rawToken = crypto.randomBytes(64);
        const token = this.base64Url(rawToken);
        const expiresAt = new Date(Date.now() + dayToExpire * 24 * 60 * 60 * 1000);
        return { token, expiresAt };
    }
    async generateEmailVerificationToken(minutesToExpire = 60) {
        const raw = crypto.randomBytes(32);
        const token = this.base64Url(raw);
        const expiresAt = new Date(Date.now() + minutesToExpire * 60 * 1000);
        return { token, expiresAt };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
    }
    base64Url(buffer) {
        return buffer
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], TokenService);
//# sourceMappingURL=token.service.js.map