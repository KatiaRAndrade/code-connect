import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { PostsService } from './posts.service';

@Controller('v1/posts')
@UseGuards(OptionalAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: QueryPostsDto, @Req() req: Request) {
    const userId: number | undefined = (req as any)['user']?.sub;
    return this.postsService.findAll(query, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId: number | undefined = (req as any)['user']?.sub;
    const post = await this.postsService.findOne(+id, userId);
    if (!post) throw new NotFoundException('Post não encontrado');
    return { data: post };
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async create(@Body() dto: CreatePostDto, @Req() req: Request) {
    const userId: number = (req as any)['user'].sub;
    const post = await this.postsService.create(dto, userId);
    return { data: post };
  }

  @Post(':id/likes')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  likePost(@Param('id') id: string, @Req() req: Request) {
    const userId: number = (req as any)['user'].sub;
    return this.postsService.toggleLike(+id, userId);
  }

  @Delete(':id/likes')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async unlikePost(@Param('id') id: string, @Req() req: Request) {
    const userId: number = (req as any)['user'].sub;
    await this.postsService.unlike(+id, userId);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.postsService.getComments(+id);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userId: number = (req as any)['user'].sub;
    const comment = await this.postsService.createComment(+id, dto, userId);
    return { data: comment };
  }
}
