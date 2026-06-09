import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import type { Post } from '../../../api/posts'
import { PostCard } from './PostCard'

const mockPost: Post = {
  id: 1,
  title: 'Construindo com React',
  description: 'Descrição completa do post sobre React e boas práticas.',
  thumbnailUrl: null,
  tags: ['React', 'TypeScript'],
  likesCount: 5,
  commentsCount: 3,
  likedByMe: false,
  createdAt: new Date().toISOString(),
  author: { id: 2, name: 'Julio Oliveira', email: 'julio@test.com' },
}

function renderCard(props: Partial<React.ComponentProps<typeof PostCard>> = {}) {
  render(
    <MemoryRouter>
      <PostCard post={mockPost} {...props} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('renders post title and description', () => {
    renderCard()
    expect(screen.getByText('Construindo com React')).toBeInTheDocument()
    expect(screen.getByText(/Descrição completa/)).toBeInTheDocument()
  })

  it('renders all tags', () => {
    renderCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders placeholder when thumbnailUrl is null', () => {
    renderCard()
    expect(screen.getByText('image')).toBeInTheDocument()
  })

  it('shows like count', () => {
    renderCard()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onLike when like button is clicked and canInteract is true', async () => {
    const onLike = vi.fn()
    renderCard({ canInteract: true, onLike })
    const likeBtn = screen.getByRole('button', { name: /curtir post/i })
    await userEvent.click(likeBtn)
    expect(onLike).toHaveBeenCalledWith(1)
  })

  it('does not call onLike when canInteract is false', async () => {
    const onLike = vi.fn()
    renderCard({ canInteract: false, onLike })
    const likeBtn = screen.getByRole('button', { name: /curtir post/i })
    await userEvent.click(likeBtn)
    expect(onLike).not.toHaveBeenCalled()
  })

  it('calls onUnlike when post is already liked and canInteract is true', async () => {
    const onUnlike = vi.fn()
    renderCard({
      canInteract: true,
      onUnlike,
      post: { ...mockPost, likedByMe: true },
    })
    const likeBtn = screen.getByRole('button', { name: /descurtir post/i })
    await userEvent.click(likeBtn)
    expect(onUnlike).toHaveBeenCalledWith(1)
  })

  it('renders author handle', () => {
    renderCard()
    expect(screen.getByText('@julio')).toBeInTheDocument()
  })
})
