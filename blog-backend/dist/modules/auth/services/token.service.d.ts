import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtAccessPayload } from '../types/jwt-payload.type';
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateAccessToken(payload: JwtAccessPayload): Promise<string>;
    generateRefreshToken(dayToExpire?: number): Promise<{
        token: string;
        expiresAt: Date;
    }>;
    generateEmailVerificationToken(minutesToExpire?: number): Promise<{
        token: string;
        expiresAt: Date;
    }>;
    hashToken(token: string): string;
    private base64Url;
}
