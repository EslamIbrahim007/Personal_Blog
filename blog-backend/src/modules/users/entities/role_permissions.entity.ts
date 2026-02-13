import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./roles.entity";
import { Permission } from "./permissions.entity";


@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission {
    @Column({ name: 'role_id', type: 'uuid', primary: true })
    roleId: string;

    @Column({ name: 'permission_id', type: 'uuid', primary: true })
    permissionId: string;

    @ManyToOne(() => Role, role => role.rolePermissions)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, permission => permission.rolePermissions)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

}