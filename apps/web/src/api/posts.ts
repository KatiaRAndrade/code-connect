import { client } from './client'

export interface PostAuthor {
  id: number
  name: string
  email: string
}

export interface Post {
  id: number
  title: string
  description: string
  thumbnailUrl: string | null
  tags: string[]
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  createdAt: string
  author: PostAuthor
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  author: PostAuthor
}

export interface PostsMeta {
  total: number
  page: number
  limit: number
}

export interface PostsResponse {
  data: Post[]
  meta: PostsMeta
}

export interface PostsQuery {
  q?: string
  sort?: 'recent' | 'popular'
  page?: number
  limit?: number
}

export async function getPosts(query: PostsQuery = {}): Promise<PostsResponse> {
  const params = new URLSearchParams()
  if (query.q) params.set('q', query.q)
  if (query.sort) params.set('sort', query.sort)
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  const qs = params.toString()
  const { data } = await client.get<PostsResponse>(`/posts${qs ? `?${qs}` : ''}`)
  return data
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await client.get<{ data: Post }>(`/posts/${id}`)
  return data.data
}

export async function likePost(postId: number): Promise<{ liked: boolean }> {
  const { data } = await client.post<{ liked: boolean }>(`/posts/${postId}/likes`)
  return data
}

export async function unlikePost(postId: number): Promise<void> {
  await client.delete(`/posts/${postId}/likes`)
}

export async function getComments(postId: number): Promise<Comment[]> {
  const { data } = await client.get<{ data: Comment[] }>(`/posts/${postId}/comments`)
  return data.data
}

export async function createComment(postId: number, content: string): Promise<Comment> {
  const { data } = await client.post<{ data: Comment }>(`/posts/${postId}/comments`, { content })
  return data.data
}

export async function createPost(payload: {
  title: string
  description: string
  thumbnailUrl?: string
  tags?: string[]
}): Promise<Post> {
  const { data } = await client.post<{ data: Post }>('/posts', payload)
  return data.data
}
