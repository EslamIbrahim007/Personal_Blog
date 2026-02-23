import { User } from '../../users/entities/user.entity';
export declare class UserSession {
    id: string;
    userId: string;
    user: User;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    ip?: string;
    userAgent?: string;
    createdAt: Date;
}
