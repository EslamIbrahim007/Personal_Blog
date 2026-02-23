import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { UserRole } from './entities/user-role.entity';
export declare class UsersService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly userRoleRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, userRoleRepository: Repository<UserRole>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOneByEmail(email: string): Promise<User>;
    assignRoleToUser(userId: string, roleName: string): Promise<void>;
}
