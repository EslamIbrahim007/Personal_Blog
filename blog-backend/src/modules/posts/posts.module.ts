import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostTranslation } from './entities/post-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTranslation])],
  controllers: [],
  providers: [],
})
export class PostsModule { }
