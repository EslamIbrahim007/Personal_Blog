import { UserRole } from "../types/user-role.enum";
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
