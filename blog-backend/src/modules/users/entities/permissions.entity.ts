import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermission } from "./role_permissions.entity";


@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index({ unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description?: string;

    @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
    rolePermissions: RolePermission[];
}
