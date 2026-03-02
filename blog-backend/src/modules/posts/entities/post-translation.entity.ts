import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";


@Entity('post_translations')
@Unique(['postId', 'language'])
@Unique(['language', 'slug'])
export class PostTranslation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ name: 'post_id', type: 'uuid' })
    postId: string;

    @ManyToOne(() => Post, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column({ name: 'language', type: 'varchar', length: 5 })
    language: "en" | "ar";

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ type: 'varchar', length: 255 })
    excerpt: string;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}