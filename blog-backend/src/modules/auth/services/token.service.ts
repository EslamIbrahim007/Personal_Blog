import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import { JwtAccessPayload } from '../types/jwt-payload.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

  // Generate Access Token
  async generateToken(payload: JwtAccessPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  // Generate Refresh Token
  async generateRefreshToken(dayToExpire = 30): Promise<{ token: string, expiresAt: Date }> {
    const rawToken = crypto.randomBytes(64);
    const token = this.base64Url(rawToken);
    const expiresAt = new Date(Date.now() + dayToExpire * 24 * 60 * 60 * 1000); // 30 days
    return { token, expiresAt };
  }

  // Generate Email Verification Token
  async generateEmailVerificationToken(minutesToExpire = 60): Promise<{ token: string, expiresAt: Date }> {
    const raw = crypto.randomBytes(32);
    const token = this.base64Url(raw);
    //const hashedToken = this.hashToken(raw.toString('hex'));
    const expiresAt = new Date(Date.now() + minutesToExpire * 60 * 1000);
    return { token, expiresAt };
  }

  /**
*  SHA-256 hash (hex) used for refresh/reset/verify tokens
*/
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
  }

  /**
 * base64url encoding without padding.
 */
  private base64Url(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
}
