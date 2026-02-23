import { User } from "./user.entity";
export declare class PasswordResetToken {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    used_at: Date;
    createdAt: Date;
    user: User;
}
