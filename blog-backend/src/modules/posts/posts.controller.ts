import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Search, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { JwtAuthGuard } from '../../Guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from "../../Decorator/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { ListPostsQueryDto } from "./dto/list-posts.query.dto";

@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('create')
  @RequirePermissions('POST_CREATE')
  async create(@CurrentUser() currentUser: User, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(currentUser.id, createPostDto);
  }


  @Post('publish/:id')
  @RequirePermissions('POST_PUBLISH_OWN')
  async publish(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.postsService.publish(id, currentUser.id);
  }

  @Put('update/:id')
  @RequirePermissions('POST_UPDATE_OWN')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @CurrentUser() currentUser: User) {
    return this.postsService.update(id, currentUser.id, updatePostDto);
  }

  @Delete('delete/:id')
  @RequirePermissions('POST_DELETE_OWN')
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.postsService.delete(id, currentUser.id);
  }


  @Get('public')
  async listPublic(
    @Query() query: ListPostsQueryDto,
    ) {
    return this.postsService.listPublic(query);
  }

  @Get(':lang/:slug')
  async getPublicBySlug(@Param('lang') lang: 'ar' | 'en', @Param('slug') slug: string) {
    return this.postsService.getPublicBySlug(lang, slug);
  }

  @Get('own/:id')
  @RequirePermissions('POST_GET_OWN')
  async getOwnPost(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.postsService.getOwnPost(id, currentUser.id);
  }
}