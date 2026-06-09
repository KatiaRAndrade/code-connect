import { useState } from 'react'
import { Button } from '../../atoms/Button'
import { FormField } from '../../molecules/FormField'
import { TagInput } from '../../molecules/TagInput'
import { TextareaField } from '../../molecules/TextareaField'
import { createPost, type Post } from '../../../api/posts'
import { getErrorMessage } from '../../../api/client'

interface PostFormProps {
  onCreated: (post: Post) => void
}

export function PostForm({ onCreated }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const post = await createPost({
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        tags,
      })
      onCreated(post)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl" noValidate>
      <FormField
        id="title"
        label="Título"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do post"
      />

      <TextareaField
        id="description"
        label="Descrição"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Conte mais sobre o seu post"
        rows={6}
      />

      <FormField
        id="thumbnailUrl"
        label="URL da imagem de capa (opcional)"
        name="thumbnailUrl"
        type="url"
        value={thumbnailUrl}
        onChange={(e) => setThumbnailUrl(e.target.value)}
        placeholder="https://..."
      />

      <TagInput id="tags" label="Tags" tags={tags} onChange={setTags} placeholder="Ex: React, TypeScript" />

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Publicando...' : 'Publicar'}
      </Button>
    </form>
  )
}
