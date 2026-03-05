import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostTranslation } from './entities/post-translation.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Logger } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostTranslation])],
  controllers: [PostsController],
  providers: [PostsService, Logger],
  exports: [PostsService],
})
export class PostsModule { }
