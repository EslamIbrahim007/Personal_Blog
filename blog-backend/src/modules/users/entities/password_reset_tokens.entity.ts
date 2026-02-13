import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, } from "typeorm";
import { User } from "./user.entity";


@Entity('password_reset_tokens')
export class PasswordResetToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 255 })
    token_hash: string;

    @Column({ type: 'timestamp' })
    expires_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    used_at: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.passwordResetTokens)
    @JoinColumn({ name: 'user_id' })
    user: User;
}