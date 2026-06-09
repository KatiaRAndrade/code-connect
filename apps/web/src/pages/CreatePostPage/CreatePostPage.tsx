import { Navigate, useNavigate } from 'react-router-dom'
import { PostForm } from '../../components/organisms/PostForm'
import { AppLayout } from '../../components/templates/AppLayout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import type { Post } from '../../api/posts'

export function CreatePostPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (!loading && !user) {
    return <Navigate to="/login" replace />
  }

  function handleCreated(post: Post) {
    navigate(`/posts/${post.id}`)
  }

  return (
    <>
      <title>Nova publicação — Code Connect</title>
      <AppLayout>
        <div className="flex flex-col gap-8 max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nova publicação</h1>
            <p className="text-sm text-muted">Compartilhe algo com a comunidade.</p>
          </div>

          <PostForm onCreated={handleCreated} />
        </div>
      </AppLayout>
    </>
  )
}
