import { Injectable } from "@nestjs/common";
import { ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Not } from "typeorm";
import { Post } from "./entities/post.entity";
import { PostTranslation } from "./entities/post-translation.entity";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import slugify from "slugify";
import { PostStatus } from "./dto/post-status.enum";
import { randomBytes } from "crypto";
import { ListPostsQueryDto } from "./dto/list-posts.query.dto";



@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(PostTranslation)
    private readonly postTranslationRepo: Repository<PostTranslation>,
    private readonly dataSource: DataSource,
  ) { }

  // Build Slug
  private BuildSlug(title: string, fallbackPrefix?: 'post'): string {
    //slugify
    const slug = slugify(title, {
      lower: true,
      strict: true, //remove special characters ; for arabic 
      trim: true,
    });

    if (slug && slug.length >= 3) return slug;

    //Fallback when slug is null or empty or less than 3 characters
    return `${fallbackPrefix}-${shortId()}`;
  }


  // Ensure Unique Slug
  private async ensureUniqueSlug(language: "en" | "ar", slug: string, ignoreTranslationId?: string) {
    const exists = await this.postTranslationRepo.findOne({
      where: ignoreTranslationId ?
        { language, slug, id: Not(ignoreTranslationId) as any } :
        { language, slug },
    });

    if (exists) {
      throw new BadRequestException(`Slug ${slug} already exists in ${language}`);
    }
  }

  async create(authorId: string, createPostDto: CreatePostDto) {
    //1. check if translations is valid
    const { translations } = createPostDto;
    if (!translations || translations.length === 0) {
      throw new BadRequestException('Translations is required');
    }
    //2. check if languages is valid not duplicate language
    const languages = translations.map(t => t.language);
    const uniqueLanguages = new Set(languages);
    if (uniqueLanguages.size !== languages.length) {
      throw new BadRequestException('Duplicate languages found');
    }
    //3. create post and translations
    return this.dataSource.transaction(async (manager) => {
      const post = manager.create(Post, {
        authorId,
        status: PostStatus.DRAFT,
        publishedAt: null,
      });

      await manager.save(post);

      //create translations
      const translations: PostTranslation[] = [];
      for (const t of createPostDto.translations) {
        const slug = t.slug?.trim() || this.BuildSlug(t.title, 'post').toLowerCase();

        //check if slug exists
        const existing = await manager.findOne(PostTranslation, {
          where: { language: t.language, slug },
        });
        if (existing) {
          throw new BadRequestException(`Slug ${slug} already exists in ${t.language}`);
        }

        //create translation
        const tr = manager.create(PostTranslation, {
          postId: post.id,
          language: t.language,
          title: t.title,
          slug,
          excerpt: t.excerpt ?? null,
          content: t.content,
        });
        translations.push(tr);
      }
      await manager.save(translations);

      return manager.findOne(Post, {
        where: { id: post.id },
        relations: { translations: true },
      });
    });

  }

  private async getPostOrFail(id: string) {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  };

  private assertOwnership(post: Post, userId: string) {
    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    //1. get post and assert ownership
    const post = await this.getPostOrFail(id);
    //assert ownership
    this.assertOwnership(post, userId);

    if (!updatePostDto.translations || updatePostDto.translations.length === 0) {
      return post;
    }

    //2. update post
    return this.dataSource.transaction(async (manager) => {
      //update each transation if exists or create new one
      for (const t of updatePostDto.translations) {
        let tr = await manager.findOne(PostTranslation, {
          where: { postId: post.id, language: t.language },
        });

        const nextTitle = t.title?.trim() || tr.title;
        const nextSlug = t.slug?.trim() ||
          (t.title ? this.BuildSlug(t.title).toLowerCase() : tr?.slug) ||
          this.BuildSlug(nextTitle).toLowerCase();

        //ensure unique slug
        const conflict = await manager.findOne(PostTranslation, {
          where: tr ?
            { language: t.language, slug: nextSlug, postId: Not(post.id) } :
            { language: t.language, slug: nextSlug },
        });

        if (conflict) {
          throw new BadRequestException(`Slug ${nextSlug} already exists in ${t.language}`);
        }

        //update or create
        if (tr) {
          tr.title = nextTitle;
          tr.slug = nextSlug;
          if (t.excerpt !== undefined) tr.excerpt = t.excerpt?.trim() || tr.excerpt;
          if (t.content !== undefined) tr.content = t.content?.trim() || tr.content;
        } else {
          tr = manager.create(PostTranslation, {
            postId: post.id,
            language: t.language,
            title: nextTitle,
            slug: nextSlug,
            excerpt: t.excerpt?.trim() || null,
            content: t.content?.trim() || '',
          });
        }
        await manager.save(tr);
      }
      return manager.findOne(Post, {
        where: { id: post.id },
        relations: { translations: true },
      });

    });
  }

  async publish(postId: string, userId: string) {
    //1. get post and assert ownership
    const post = await this.getPostOrFail(postId);
    this.assertOwnership(post, userId);
    //2. check post status
    if (post.status === PostStatus.PUBLISHED) {
      return post;
    }
    //3. update post status and published date
    post.status = PostStatus.PUBLISHED;
    post.publishedAt = new Date();
    //4. save post
    await this.postRepo.save(post);
    //5. return post with translations
    return this.getPostOrFail(postId);
  }

  async delete(postId: string, userId: string) {
    //1. get post and assert ownership
    const post = await this.getPostOrFail(postId);
    this.assertOwnership(post, userId);
    //2. delete post
    await this.postRepo.delete(postId);
    //3. return success message
    return { message: 'Post deleted successfully' };
  }

  //list all posts 
  async listPublic(query: ListPostsQueryDto) {
    const take = Math.min(Math.max(query.limit, 1), 50);
    const skip = (Math.max(query.page, 1) - 1) * take;
    const order = query.sortOrder === 'DESC' ? 'DESC' : 'ASC';

    const qb = this.postRepo
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.translations', 'translation', 'translation.language = :lang', { lang: query.lang })
      .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.publishedAt IS NOT NULL')


    if (query.search.trim() !== '') {
      qb.andWhere('translation.title ILIKE :q OR translation.content ILIKE :q', { q: `%${query.search}%` });
    }

    qb.orderBy(`post.publishedAt`, order).skip(skip).take(take);

    const [posts, count] = await qb.getManyAndCount();

    return { posts, count, page: Math.max(query.page, 1), limit: take };
  };

  async getPublicBySlug(lang: 'ar' | 'en', slug: string) {
    const post = await this.postRepo
      .createQueryBuilder('post')
      .innerJoinAndSelect('post.translations', 'translation', 'translation.language = :lang', { lang, slug })
      .andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.publishedAt IS NOT NULL')
      .getOne();
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    return post;
  };

  async getOwnPost(postId: string, userId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { translations: true },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    this.assertOwnership(post, userId);
    return post;
  }
}
function shortId() {
  return randomBytes(4).toString('hex');
}
