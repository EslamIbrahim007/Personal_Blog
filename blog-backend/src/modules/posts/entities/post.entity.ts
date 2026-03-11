import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {User} from "../../users/entities/user.entity";
import { PostTranslation } from "./post-translation.entity";
import {PostStatus} from "../dto/post-status.enum";
import { Category } from "../../categories/entities/category.entity";
import { Tag } from "../../tags/entities/tag.entity";



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

    @ManyToMany(() => Category, (category) => category.posts)
    @JoinTable({
        name: 'post_categories',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];

    @ManyToMany(() => Tag, (tag) => tag.posts)
    @JoinTable({
        name: 'post_tags',
        joinColumn: { name: 'post_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags: Tag[];  
}