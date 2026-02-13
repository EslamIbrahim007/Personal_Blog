import { UserRole } from "../types/user-role.enum";
export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    avatar: string;
    coverImage: string;
    bio: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}
