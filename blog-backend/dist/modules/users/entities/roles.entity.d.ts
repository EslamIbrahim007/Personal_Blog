import { UserRole } from "./user-role.entity";
import { RolePermission } from "./role_permissions.entity";
export declare class Role {
    id: string;
    name: string;
    createdAt: Date;
    userRoles: UserRole[];
    rolePermissions: RolePermission[];
}
