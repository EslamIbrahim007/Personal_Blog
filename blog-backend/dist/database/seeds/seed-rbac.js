"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRbac = seedRbac;
const roles_entity_1 = require("../../modules/users/entities/roles.entity");
const permissions_entity_1 = require("../../modules/users/entities/permissions.entity");
const role_permissions_entity_1 = require("../../modules/users/entities/role_permissions.entity");
async function seedRbac(dataSource) {
    const roleRepo = dataSource.getRepository(roles_entity_1.Role);
    const permRepo = dataSource.getRepository(permissions_entity_1.Permission);
    const rolePermRepo = dataSource.getRepository(role_permissions_entity_1.RolePermission);
    const roleNames = ['Admin', 'Author', 'Reader'];
    const rolesMap = {};
    for (const name of roleNames) {
        let role = await roleRepo.findOne({ where: { name } });
        if (!role) {
            role = await roleRepo.save(roleRepo.create({ name }));
        }
        rolesMap[name] = role;
    }
    const permissionKeys = [
        'POST_CREATE',
        'POST_UPDATE_OWN',
        'POST_DELETE_OWN',
        'POST_PUBLISH_OWN',
        'CATEGORY_MANAGE',
        'TAG_MANAGE',
        'USER_MANAGE',
        'ROLE_MANAGE',
    ];
    const permsMap = {};
    for (const key of permissionKeys) {
        let perm = await permRepo.findOne({ where: { name: key } });
        if (!perm) {
            perm = await permRepo.save(permRepo.create({ name: key }));
        }
        permsMap[key] = perm;
    }
    const rolePermissionMap = {
        Admin: permissionKeys,
        Author: [
            'POST_CREATE',
            'POST_UPDATE_OWN',
            'POST_DELETE_OWN',
            'POST_PUBLISH_OWN',
        ],
        Reader: [],
    };
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
//# sourceMappingURL=seed-rbac.js.map