import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createComment,
  getComments,
  getPost,
  likePost,
  unlikePost,
  type Comment,
  type Post,
} from '../../api/posts'
import { Tag } from '../../components/atoms/Tag/Tag'
import { AppLayout } from '../../components/templates/AppLayout/AppLayout'
import { useAuth } from '../../context/AuthContext'

function ThumbnailPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-input rounded-lg">
      <span className="material-icons text-muted" style={{ fontSize: 64 }}>
        image
      </span>
    </div>
  )
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getPost(Number(id)), getComments(Number(id))])
      .then(([p, c]) => {
        setPost(p)
        setComments(c)
      })
      .catch(() => navigate('/feed'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleLike() {
    if (!post || !user) return
    const result = await likePost(post.id)
    setPost((prev) =>
      prev
        ? {
            ...prev,
            likedByMe: result.liked,
            likesCount: prev.likesCount + (result.liked ? 1 : -1),
          }
        : prev,
    )
  }

  async function handleUnlike() {
    if (!post || !user) return
    await unlikePost(post.id)
    setPost((prev) =>
      prev ? { ...prev, likedByMe: false, likesCount: Math.max(0, prev.likesCount - 1) } : prev,
    )
  }

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault()
    if (!post || !user || !commentInput.trim()) return
    setSubmitting(true)
    try {
      const comment = await createComment(post.id, commentInput.trim())
      setComments((prev) => [...prev, comment])
      setCommentInput('')
      setPost((prev) => (prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-72 rounded-lg bg-surface-sidebar animate-pulse" />
          <div className="h-8 w-2/3 rounded bg-surface-sidebar animate-pulse" />
          <div className="h-24 rounded bg-surface-sidebar animate-pulse" />
        </div>
      </AppLayout>
    )
  }

  if (!post) return null

  const authorHandle = `@${post.author.name.split(' ')[0].toLowerCase()}`

  return (
    <>
      <title>{post.title} — Code Connect</title>
      <AppLayout>
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {/* Thumbnail */}
          <div className="h-72 w-full bg-surface-sidebar p-6 rounded-lg">
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover rounded-lg shadow-lg"
              />
            ) : (
              <ThumbnailPlaceholder />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
            <p className="text-sm text-muted leading-relaxed">{post.description}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-divider">
              <div className="flex items-center gap-4 text-muted text-sm">
                <button
                  type="button"
                  onClick={post.likedByMe ? handleUnlike : handleLike}
                  disabled={!user}
                  aria-label={post.likedByMe ? 'Descurtir post' : 'Curtir post'}
                  aria-pressed={post.likedByMe}
                  className={`flex items-center gap-1.5 transition-colors ${
                    user ? 'hover:text-brand cursor-pointer' : 'cursor-default'
                  } ${post.likedByMe ? 'text-brand' : ''}`}
                >
                  <span className="material-icons" style={{ fontSize: 20 }}>code</span>
                  <span>{post.likesCount}</span>
                </button>

                <span className="flex items-center gap-1.5">
                  <span className="material-icons" style={{ fontSize: 20 }}>chat</span>
                  <span>{post.commentsCount}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-input">
                  <span className="material-icons" style={{ fontSize: 20 }}>person</span>
                </div>
                <span className="font-semibold">{authorHandle}</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Comentários ({comments.length})
            </h2>

            {user ? (
              <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
                <label htmlFor="comment-input" className="sr-only">Adicionar comentário</label>
                <textarea
                  id="comment-input"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Adicione um comentário…"
                  rows={3}
                  className="w-full rounded-md bg-surface-input px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-1 focus:ring-brand resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !commentInput.trim()}
                    className="px-4 py-2 rounded-md bg-brand text-black text-sm font-semibold disabled:opacity-50 hover:brightness-95 transition-all"
                  >
                    {submitting ? 'Enviando…' : 'Comentar'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-muted">
                <a href="/login" className="text-brand hover:underline">Faça login</a>{' '}
                para comentar.
              </p>
            )}

            {comments.length === 0 ? (
              <p className="text-sm text-muted py-4">Nenhum comentário ainda. Seja o primeiro!</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="flex flex-col gap-1 rounded-md bg-surface-sidebar p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-input">
                        <span className="material-icons" style={{ fontSize: 14 }}>person</span>
                      </div>
                      <span className="font-semibold text-foreground-light">
                        @{c.author.name.split(' ')[0].toLowerCase()}
                      </span>
                      <span>·</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-sm text-foreground-light pl-8">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}
