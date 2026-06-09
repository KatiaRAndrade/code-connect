import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { axe } from 'jest-axe'
import { AuthContext } from '../../context/AuthContext'
import { CreatePostPage } from './CreatePostPage'

function renderWithAuth(user: { id: number; name: string; email: string } | null) {
  return render(
    <AuthContext.Provider value={{ user, loading: false, signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn() }}>
      <MemoryRouter initialEntries={['/nova-publicacao']}>
        <Routes>
          <Route path="/nova-publicacao" element={<CreatePostPage />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
}

test('redireciona para /login quando não autenticado', () => {
  renderWithAuth(null)
  expect(screen.getByText('Login Page')).toBeInTheDocument()
})

test('renderiza o formulário de publicação quando autenticado', () => {
  renderWithAuth({ id: 1, name: 'Test User', email: 'test@email.com' })
  expect(screen.getByRole('heading', { name: 'Nova publicação' })).toBeInTheDocument()
  expect(screen.getByLabelText('Título')).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderWithAuth({ id: 1, name: 'Test User', email: 'test@email.com' })
  expect(await axe(container)).toHaveNoViolations()
})
