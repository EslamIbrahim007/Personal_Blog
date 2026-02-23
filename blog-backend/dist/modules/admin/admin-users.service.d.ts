import { Repository, DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Role } from '../users/entities/roles.entity';
import { UserRole } from '../users/entities/user-role.entity';
export declare class AdminUsersService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly userRoleRepository;
    private readonly dataSource;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, userRoleRepository: Repository<UserRole>, dataSource: DataSource);
    setUserRole(userId: string, roleName: 'Admin' | 'Author' | 'Reader'): Promise<void>;
    listUsersBasic(): Promise<Array<{
        id: string;
        email: string;
    }>>;
}
