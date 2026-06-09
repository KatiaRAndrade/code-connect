import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { getPosts, likePost, unlikePost, type Post, type PostsQuery } from '../../api/posts'
import { Tag } from '../../components/atoms/Tag/Tag'
import { PostCard } from '../../components/organisms/PostCard/PostCard'
import { AppLayout } from '../../components/templates/AppLayout/AppLayout'
import { useAuth } from '../../context/AuthContext'

type SortTab = 'recent' | 'popular'

export function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [sort, setSort] = useState<SortTab>('recent')
  const searchRef = useRef<HTMLInputElement>(null)
  const LIMIT = 12

  const fetchPosts = useCallback(
    async (query: PostsQuery, replace = true) => {
      setLoading(true)
      try {
        const res = await getPosts(query)
        setPosts((prev) => (replace ? res.data : [...prev, ...res.data]))
        setTotal(res.meta.total)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Initial + re-fetch when sort or activeQuery changes
  useEffect(() => {
    setPage(1)
    fetchPosts({ q: activeQuery || undefined, sort, page: 1, limit: LIMIT }, true)
  }, [activeQuery, sort, fetchPosts])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setActiveQuery(searchInput.trim())
  }

  function clearSearch() {
    setSearchInput('')
    setActiveQuery('')
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchPosts({ q: activeQuery || undefined, sort, page: next, limit: LIMIT }, false)
  }

  async function handleLike(postId: number) {
    if (!user) return
    const result = await likePost(postId)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: result.liked, likesCount: p.likesCount + (result.liked ? 1 : -1) }
          : p,
      ),
    )
  }

  async function handleUnlike(postId: number) {
    if (!user) return
    await unlikePost(postId)
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likedByMe: false, likesCount: Math.max(0, p.likesCount - 1) } : p,
      ),
    )
  }

  const hasMore = posts.length < total

  return (
    <>
      <title>Feed — Code Connect</title>
      <AppLayout>
        <div className="flex flex-col gap-14 max-w-5xl mx-auto">
          {/* Search */}
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} role="search">
              <label htmlFor="search-input" className="sr-only">Buscar posts</label>
              <div className="flex items-center gap-4 bg-surface-sidebar rounded px-4 py-2">
                <span className="material-icons text-muted text-3xl">search</span>
                <input
                  id="search-input"
                  ref={searchRef}
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Digite o que você procura"
                  className="flex-1 bg-transparent text-foreground-light text-base outline-none placeholder:text-muted"
                />
              </div>
            </form>

            {activeQuery && (
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Tag label={activeQuery} onRemove={clearSearch} variant="active" />
                </div>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm text-muted hover:text-foreground-light transition-colors"
                >
                  Limpar tudo
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-6 justify-center border-b border-surface-divider pb-0">
              {(['recent', 'popular'] as SortTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSort(tab)}
                  className={`pb-3 text-lg font-medium transition-colors border-b-2 -mb-px ${
                    sort === tab
                      ? 'border-brand text-brand underline'
                      : 'border-transparent text-muted hover:text-foreground-light'
                  }`}
                >
                  {tab === 'recent' ? 'Recentes' : 'Populares'}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading && posts.length === 0 ? (
              <div className="grid grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-lg bg-surface-sidebar animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center text-muted py-20">
                Nenhum post encontrado{activeQuery ? ` para "${activeQuery}"` : ''}.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      canInteract={!!user}
                      onLike={handleLike}
                      onUnlike={handleUnlike}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="px-6 py-2 rounded-md border border-surface-divider text-muted hover:text-foreground-light hover:border-brand transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Carregando…' : 'Carregar mais'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  )
}
