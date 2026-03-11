import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostTranslation } from './entities/post-translation.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Logger } from '@nestjs/common';

import { CategoriesModule } from '../categories/categories.module';
import { TagsModule } from '../tags/tags.module';

import { Category} from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTranslation, Category, Tag])],
  controllers: [PostsController],
  providers: [PostsService, Logger],
  exports: [PostsService],
})
export class PostsModule { }
