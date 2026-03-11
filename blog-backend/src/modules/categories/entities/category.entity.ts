import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";

@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Index({unique:true})
    @Column()
    name:string;

    
    @Column()
    slug:string;

    @Column()
    createdAt:Date;

    @Column()
    updatedAt:Date;

    @OneToMany(()=>Post, (post)=>post.categories)
    posts:Post[];

}


