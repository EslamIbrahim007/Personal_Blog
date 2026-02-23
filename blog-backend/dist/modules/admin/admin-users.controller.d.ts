import { AdminUsersService } from './admin-users.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';
export declare class AdminUsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    listUsers(): Promise<{
        id: string;
        email: string;
    }[]>;
    setRole(userId: string, dto: AddUserRoleDto): Promise<{
        message: string;
    }>;
}
