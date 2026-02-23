import { RolePermission } from "./role_permissions.entity";
export declare class Permission {
    id: string;
    name: string;
    description?: string;
    rolePermissions: RolePermission[];
}
