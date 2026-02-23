import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/roles.entity';
import { UserRole } from '../users/entities/user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  controllers: [AdminUsersController],
  providers: [AdminUsersService],
})
export class AdminModule {}