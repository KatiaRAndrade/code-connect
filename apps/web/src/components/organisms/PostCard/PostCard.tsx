import { useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Tag } from '../../atoms/Tag/Tag'
import type { Post } from '../../../api/posts'

interface PostCardProps {
  post: Post
  onLike?: (postId: number) => void
  onUnlike?: (postId: number) => void
  canInteract?: boolean
}

function ThumbnailPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-input rounded-lg">
      <span className="material-icons text-muted" style={{ fontSize: 48 }}>
        image
      </span>
    </div>
  )
}

function Thumbnail({ url }: { url: string | null }) {
  const [error, setError] = useState(false)
  if (!url || error) return <ThumbnailPlaceholder />
  return (
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover rounded-lg shadow-lg"
      loading="lazy"
      onError={() => setError(true)}
    />
  )
}

export function PostCard({ post, onLike, onUnlike, canInteract }: PostCardProps) {
  const authorHandle = `@${post.author.name.split(' ')[0].toLowerCase()}`

  function handleLikeClick(e: MouseEvent) {
    e.preventDefault()
    if (!canInteract) return
    if (post.likedByMe) {
      onUnlike?.(post.id)
    } else {
      onLike?.(post.id)
    }
  }

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex flex-col rounded-lg overflow-hidden bg-surface-sidebar hover:ring-1 hover:ring-surface-divider transition-all"
      aria-label={`Ver post: ${post.title}`}
    >
      {/* Thumbnail */}
      <div className="h-60 w-full bg-surface-sidebar p-6 shrink-0">
        <Thumbnail url={post.thumbnailUrl} />
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-4 flex-1">
        {/* Title + description */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground-light leading-snug line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Actions + author */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-muted text-xs">
            <button
              type="button"
              onClick={handleLikeClick}
              aria-label={post.likedByMe ? 'Descurtir post' : 'Curtir post'}
              aria-pressed={post.likedByMe}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                canInteract ? 'hover:text-brand cursor-pointer' : 'cursor-default'
              } ${post.likedByMe ? 'text-brand' : ''}`}
            >
              <span className="material-icons" style={{ fontSize: 20 }}>code</span>
              <span>{post.likesCount ?? 0}</span>
            </button>

            <span className="flex flex-col items-center gap-0.5">
              <span className="material-icons" style={{ fontSize: 20 }}>share</span>
              <span>0</span>
            </span>

            <span className="flex flex-col items-center gap-0.5">
              <span className="material-icons" style={{ fontSize: 20 }}>chat</span>
              <span>{post.commentsCount ?? 0}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted text-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-input">
              <span className="material-icons" style={{ fontSize: 20 }}>person</span>
            </div>
            <span className="font-semibold">{authorHandle}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
