import { DataSource } from 'typeorm';
import { Role } from '../../modules/users/entities/roles.entity';
import { Permission } from '../../modules/users/entities/permissions.entity';
import { RolePermission } from '../../modules/users/entities/role_permissions.entity';

export async function seedRbac(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);
  const permRepo = dataSource.getRepository(Permission);
  const rolePermRepo = dataSource.getRepository(RolePermission);

  // ======================
  // 1) Define Roles
  // ======================
  const roleNames = ['Admin', 'Author', 'Reader'];

  const rolesMap: Record<string, Role> = {};

  for (const name of roleNames) {
    let role = await roleRepo.findOne({ where: { name } });

    if (!role) {
      role = await roleRepo.save(roleRepo.create({ name }));
    }

    rolesMap[name] = role;
  }

  // ======================
  // 2) Define Permissions
  // ======================
  const permissionKeys = [
    'POST_CREATE',
    'POST_UPDATE_OWN',
    'POST_DELETE_OWN',
    'POST_PUBLISH_OWN',
    'POST_GET_OWN',
    'CATEGORY_MANAGE',
    'TAG_MANAGE',
    'USER_MANAGE',
    'ROLE_MANAGE',
  ];

  const permsMap: Record<string, Permission> = {};

  for (const key of permissionKeys) {
    let perm = await permRepo.findOne({ where: { name: key } });

    if (!perm) {
      perm = await permRepo.save(permRepo.create({ name: key }));
    }

    permsMap[key] = perm;
  }

  // ======================
  // 3) Role → Permissions Mapping
  // ======================
  const rolePermissionMap: Record<string, string[]> = {
    Admin: permissionKeys, // كل الصلاحيات
    Author: [
      'POST_CREATE',
      'POST_UPDATE_OWN',
      'POST_DELETE_OWN',
      'POST_PUBLISH_OWN',
      'POST_GET_OWN',
    ],
    Reader: [], 
  };

  // ======================
  // 4) Apply Mapping
  // ======================
  for (const [roleName, permissionList] of Object.entries(rolePermissionMap)) {
    const role = rolesMap[roleName];

    await rolePermRepo.delete({ roleId: role.id });

    for (const permKey of permissionList) {
      const perm = permsMap[permKey];

      await rolePermRepo.save({
        roleId: role.id,
        permissionId: perm.id,
      });
    }
  }

  console.log('✅ RBAC seeding complete');
}