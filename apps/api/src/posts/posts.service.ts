import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryPostsDto } from './dto/query-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async findAll(query: QueryPostsDto, userId?: number) {
    const { q, sort = 'recent', page = 1, limit = 12 } = query;

    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author');

    if (q && q.trim()) {
      qb.where(
        `to_tsvector('portuguese', post.title || ' ' || COALESCE(post.description, '')) @@ plainto_tsquery('portuguese', :q)`,
        { q: q.trim() },
      );
    }

    if (sort === 'popular') {
      qb.orderBy(
        `(SELECT COUNT(*) FROM likes l WHERE l."postId" = post.id)`,
        'DESC',
      ).addOrderBy('post.createdAt', 'DESC');
    } else {
      qb.orderBy('post.createdAt', 'DESC');
    }

    const total = await qb.getCount();
    const posts = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    if (posts.length === 0) {
      return { data: [], meta: { total, page, limit } };
    }

    const postIds = posts.map((p) => p.id);

    // Batch: likes count per post
    const likeRaw = await this.likeRepo
      .createQueryBuilder('like')
      .select('"postId"')
      .addSelect('COUNT(id)', 'count')
      .where('"postId" IN (:...ids)', { ids: postIds })
      .groupBy('"postId"')
      .getRawMany<{ postId: number; count: string }>();
    const likeCountMap = new Map(likeRaw.map((r) => [Number(r.postId), Number(r.count)]));

    // Batch: comments count per post
    const commentRaw = await this.commentRepo
      .createQueryBuilder('comment')
      .select('"postId"')
      .addSelect('COUNT(id)', 'count')
      .where('"postId" IN (:...ids)', { ids: postIds })
      .groupBy('"postId"')
      .getRawMany<{ postId: number; count: string }>();
    const commentCountMap = new Map(commentRaw.map((r) => [Number(r.postId), Number(r.count)]));

    // Liked by current user
    let likedSet = new Set<number>();
    if (userId) {
      const likes = await this.likeRepo.find({ where: { postId: In(postIds), userId } });
      likedSet = new Set(likes.map((l) => l.postId));
    }

    const data = posts.map((p) => ({
      ...p,
      likesCount: likeCountMap.get(p.id) ?? 0,
      commentsCount: commentCountMap.get(p.id) ?? 0,
      likedByMe: likedSet.has(p.id),
    }));

    return { data, meta: { total, page, limit } };
  }

  async findOne(id: number, userId?: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { author: true },
    });

    if (!post) return null;

    const [likesCount, commentsCount] = await Promise.all([
      this.likeRepo.count({ where: { postId: id } }),
      this.commentRepo.count({ where: { postId: id } }),
    ]);

    let likedByMe = false;
    if (userId) {
      likedByMe = !!(await this.likeRepo.findOne({ where: { postId: id, userId } }));
    }

    return { ...post, likesCount, commentsCount, likedByMe };
  }

  async create(dto: CreatePostDto, authorId: number) {
    const post = this.postRepo.create({
      ...dto,
      authorId,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      tags: dto.tags ?? [],
    });
    const saved = await this.postRepo.save(post);
    return this.postRepo.findOne({ where: { id: saved.id }, relations: { author: true } });
  }

  async toggleLike(postId: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado');

    const existing = await this.likeRepo.findOne({ where: { postId, userId } });
    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    }

    const like = this.likeRepo.create({ postId, userId });
    await this.likeRepo.save(like);
    return { liked: true };
  }

  async unlike(postId: number, userId: number) {
    const like = await this.likeRepo.findOne({ where: { postId, userId } });
    if (like) await this.likeRepo.remove(like);
  }

  async getComments(postId: number) {
    const comments = await this.commentRepo.find({
      where: { postId },
      relations: { author: true },
      order: { createdAt: 'ASC' },
    });
    return { data: comments };
  }

  async createComment(postId: number, dto: CreateCommentDto, authorId: number) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado');

    const comment = this.commentRepo.create({ postId, authorId, content: dto.content });
    const saved = await this.commentRepo.save(comment);
    return this.commentRepo.findOne({ where: { id: saved.id }, relations: { author: true } });
  }
}
