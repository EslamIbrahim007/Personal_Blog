import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../Guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { AdminUsersService } from './admin-users.service';
import { AddUserRoleDto } from './dto/add-user-role.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @RequirePermissions('USER_MANAGE')
  async listUsers() {
    return this.adminUsersService.listUsersBasic();
  }

  @Put(':userId/role')
  @RequirePermissions('ROLE_MANAGE')
  async setRole(@Param('userId') userId: string, @Body() dto: AddUserRoleDto) {
    await this.adminUsersService.setUserRole(userId, dto.roleName);
    return { message: 'Role updated' };
  }
}