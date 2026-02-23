import { User } from './user.entity';
import { Role } from './roles.entity';
export declare class UserRole {
    userId: string;
    roleId: string;
    user: User;
    role: Role;
}
