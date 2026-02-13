import { Entity, ManyToOne, JoinColumn, Column, Index, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './roles.entity';

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {
  @PrimaryColumn({ name: 'user_id', type: 'uuid', primary: true })
  userId: string;

  @PrimaryColumn({ name: 'role_id', type: 'uuid', primary: true })
  roleId: string;

  @ManyToOne(() => User, (u) => u.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (r) => r.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
