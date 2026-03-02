import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {User} from "../../users/entities/user.entity";
import { PostTranslation } from "./post-translation.entity";
import {PostStatus} from "../dto/post-status.enum";



@Entity('posts')
export class Post{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
      type: 'enum',
      enum: PostStatus,
      default: PostStatus.DRAFT
    })
    status: PostStatus;

    @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
    publishedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Index()
    @Column()
    authorId: string;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'author_id' })
    author: User;

    @OneToMany(() => PostTranslation, (translation) => translation.post,{cascade: true})
    translations: PostTranslation[];
}