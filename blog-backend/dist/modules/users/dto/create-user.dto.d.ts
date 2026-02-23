import { UserRole } from '../entities/user-role.entity';
export declare class CreateUserDto {
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}
