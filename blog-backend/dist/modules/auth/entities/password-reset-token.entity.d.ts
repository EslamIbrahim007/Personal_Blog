import { User } from '../../users/entities/user.entity';
export declare class PasswordResetToken {
    id: string;
    userId: string;
    user: User;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
}
