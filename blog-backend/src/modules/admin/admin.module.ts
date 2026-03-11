import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import{CategoriesController} from '../categories/categories.controller';
import{TagsController} from '../tags/tags.controller';
import{PostsController} from '../posts/posts.controller';

import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/roles.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Permission } from '../users/entities/permissions.entity';

import {CategoriesModule} from '../categories/categories.module';
import {TagsModule} from '../tags/tags.module';
import {PostsModule} from '../posts/posts.module';


@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole, Permission]), CategoriesModule, TagsModule, PostsModule],
  controllers: [AdminUsersController, CategoriesController, TagsController, PostsController],
  providers: [AdminUsersService],
})
export class AdminModule {}