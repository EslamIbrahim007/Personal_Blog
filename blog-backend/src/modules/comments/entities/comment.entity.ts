import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CommentStatus } from "../enums/comment_status.enum";
import {Post} from "../../posts/entities/post.entity"
import { User } from "../../users/entities/user.entity";
@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    // post
    @Index()
    @Column({name: 'post_id', nullable: false,type: 'uuid'})
    postId: string;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    // user
    @Index()
    @Column({name: 'author_id', nullable: false,type: 'uuid'})
    authorId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    //parent  comment 

    @Index()
    @Column({name: 'parent_id', nullable: true,type: 'uuid'})
    parentId: string;

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'parent_id' })
    parent: Comment;

    @Column()
    content: string;

    @Column()
    email: string;

    @Column({
        type: 'enum',
        enum: CommentStatus,
        default: CommentStatus.PENDING
    })
    status: CommentStatus;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
    
    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
    })
    deletedAt: Date;    

    
}