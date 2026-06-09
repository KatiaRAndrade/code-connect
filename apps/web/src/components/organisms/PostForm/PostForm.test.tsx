import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { PostForm } from './PostForm'
import * as postsApi from '../../../api/posts'

vi.mock('../../../api/posts')

const FAKE_POST = {
  id: 1,
  title: 'Meu novo post',
  description: 'Uma descrição com mais de dez caracteres.',
  thumbnailUrl: null,
  tags: ['React'],
  likesCount: 0,
  commentsCount: 0,
  likedByMe: false,
  createdAt: new Date().toISOString(),
  author: { id: 1, name: 'Test User', email: 'test@email.com' },
}

test('cria um post com título, descrição e tags', async () => {
  vi.mocked(postsApi.createPost).mockResolvedValue(FAKE_POST)
  const onCreated = vi.fn()

  render(<PostForm onCreated={onCreated} />)

  await userEvent.type(screen.getByLabelText('Título'), 'Meu novo post')
  await userEvent.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de dez caracteres.')
  await userEvent.type(screen.getByLabelText('Tags'), 'React{Enter}')
  await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

  expect(postsApi.createPost).toHaveBeenCalledWith({
    title: 'Meu novo post',
    description: 'Uma descrição com mais de dez caracteres.',
    thumbnailUrl: undefined,
    tags: ['React'],
  })
  expect(onCreated).toHaveBeenCalledWith(FAKE_POST)
})

test('mostra mensagem de erro quando a criação falha', async () => {
  const err = Object.assign(new Error(), {
    isAxiosError: true,
    response: { data: { message: 'Título deve ter no mínimo 3 caracteres' } },
  })
  vi.mocked(postsApi.createPost).mockRejectedValue(err)

  render(<PostForm onCreated={vi.fn()} />)

  await userEvent.type(screen.getByLabelText('Título'), 'Oi')
  await userEvent.type(screen.getByLabelText('Descrição'), 'Uma descrição com mais de dez caracteres.')
  await userEvent.click(screen.getByRole('button', { name: /publicar/i }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Título deve ter no mínimo 3 caracteres')
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(<PostForm onCreated={vi.fn()} />)
  expect(await axe(container)).toHaveNoViolations()
})
