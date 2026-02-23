import { UserRole } from "./user-role.entity";
import { UserSession } from "../../auth/entities/user-session.entity";
import { PasswordResetToken } from "../../auth/entities/password-reset-token.entity";
import { EmailVerificationToken } from "../../auth/entities/email-verification-token.entity";
export declare class User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    username: string;
    email: string;
    password: string;
    avatar: string | null;
    coverImage: string | null;
    bio: string | null;
    isActive: boolean;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userRoles: UserRole[];
    userSessions: UserSession[];
    passwordResetTokens: PasswordResetToken[];
    emailVerificationTokens: EmailVerificationToken[];
}
