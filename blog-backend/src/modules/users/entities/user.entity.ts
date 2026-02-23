import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";
import { UserRole } from "./user-role.entity";
import { UserSession } from "../../auth/entities/user-session.entity";
import { PasswordResetToken } from "../../auth/entities/password-reset-token.entity";
import { EmailVerificationToken } from "../../auth/entities/email-verification-token.entity";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    firstName: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    lastName: string | null;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index()
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    avatar: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    coverImage: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    bio: string | null;

    @Column({ type: Boolean, default: true })
    isActive: boolean;

    @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
    emailVerifiedAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => UserRole, userRole => userRole.user)
    userRoles: UserRole[];

    @OneToMany(() => UserSession, userSession => userSession.user)
    userSessions: UserSession[];

    @OneToMany(() => PasswordResetToken, passwordResetToken => passwordResetToken.user)
    passwordResetTokens: PasswordResetToken[];

    @OneToMany(() => EmailVerificationToken, (t) => t.user)
    emailVerificationTokens: EmailVerificationToken[];
}