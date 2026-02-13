import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Index } from "typeorm";
import { UserRole } from "./user-role.entity";
import { RolePermission } from "./role_permissions.entity";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 100 })
    name: string; // Admin | Author | Reader

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

    @OneToMany(() => RolePermission, rolePermission => rolePermission.role)
    rolePermissions: RolePermission[];

}
