import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.userSessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255 })
  refreshTokenHash: string;

  @Index()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;


  @Index()
  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt: Date | null;

  
  @Column({ name: 'ip', type: 'varchar', length: 64, nullable: true })
  ip?: string;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}