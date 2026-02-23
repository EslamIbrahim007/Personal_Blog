import { Role } from "./roles.entity";
import { Permission } from "./permissions.entity";
export declare class RolePermission {
    roleId: string;
    permissionId: string;
    role: Role;
    permission: Permission;
}
