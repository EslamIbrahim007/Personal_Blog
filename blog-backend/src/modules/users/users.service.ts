import { ConflictException, Injectable, NotFoundException, Logger, Inject, } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as argon2 from 'argon2';
import { User } from './entities/user.entity'
import { Role } from './entities/roles.entity';
import { UserRole } from './entities/user-role.entity';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        //1. get email, username,  from request
        let { email, username } = createUserDto;
        //2.convert email and username to lowercase
        email = email.toLowerCase();
        username = username.toLowerCase();
        //3. check if user with same email exists
        const existingUser = await this.userRepository.findOne({ where: { email: email, username: username } });
        if (existingUser) {
            throw new ConflictException('User with this email or username already exists');
        }
        //4. hash password
        const hashedPassword = await argon2.hash(createUserDto.password);
        //5. create user
        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            isActive: true,
            emailVerifiedAt: null,

        });
        await this.userRepository.save(user);
        //6. select default role for user
        const defaultRole = await this.roleRepository.findOne({ where: { name: 'Reader' } });
        if (!defaultRole) {
            throw new NotFoundException('Default role not found');
        }
        const userRole = this.userRoleRepository.create({
            userId: user.id,
            roleId: defaultRole.id,
        });
        await this.userRoleRepository.save(userRole);
        //7. return user without password
        //const { password, ...userWithoutPassword } = user;
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find()
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: {
                userRoles: {
                    role: {
                        rolePermissions: {
                            permission: true,
                        },
                    },
                },
            },
        });
    }

    async assignRoleToUser(userId: string, roleName: string): Promise<void> {
        //1. find role
        const role = await this.roleRepository.findOne({
            where: { name: roleName },
        });

        if (!role) {
            throw new NotFoundException('Role not found');
        }
        //2. check if user already has this role
        const existing = await this.userRoleRepository.findOne({
            where: {
                userId,
                roleId: role.id,
            },
        });

        if (existing) return;
        //3. assign role to user
        const userRole = this.userRoleRepository.create({
            userId,
            roleId: role.id,
        });
        await this.userRoleRepository.save(userRole);
    }
}