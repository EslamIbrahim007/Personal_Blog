import { User } from "./user.entity";
export declare class UserSession {
    id: string;
    user_id: string;
    refresh_token_hash: string;
    user_agent: string;
    ip_address: string;
    expires_at: Date;
    revoked_at: Date;
    createdAt: Date;
    user: User;
}
