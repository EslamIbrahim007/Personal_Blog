import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "./user.entity";

@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 255 })
    refresh_token_hash: string;

    @Column({ type: 'varchar', length: 255 })
    user_agent: string;

    @Column({ type: 'varchar', length: 255 })
    ip_address: string;


    @Column({ type: 'timestamp' })
    @Index()
    expires_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    @Index()
    revoked_at: Date;

    @CreateDateColumn()
    createdAt: Date;


    @ManyToOne(() => User, user => user.userSessions)
    @JoinColumn({ name: 'user_id' })
    user: User;
}