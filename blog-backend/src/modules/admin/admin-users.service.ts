import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { AddUserRoleDto } from "./dto/add-user-role.dto";
import { Role } from '../users/entities/roles.entity';
import { UserRole } from '../users/entities/user-role.entity';


@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly dataSource: DataSource,

  ) { }

  async setUserRole(userId: string, roleName: 'Admin' | 'Author' | 'Reader') {
    //1. check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    //2. check if role exists
    const role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
      throw new Error('Role not found');
    }
    //3.transaction
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(UserRole, { userId });
      await manager.insert(UserRole, { userId, roleId: role.id });
    });

  }

  // list users basic
  async listUsersBasic(): Promise<Array<{ id: string; email: string }>> {
    const users = await this.userRepository.find({
      select: { id: true, email: true },
      order: { email: 'ASC' },
    });
    return users;
  }
}