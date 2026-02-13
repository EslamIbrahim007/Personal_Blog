import { UserRole } from '../types/user-role.enum';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}
