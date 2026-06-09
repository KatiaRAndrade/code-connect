import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthContext } from '../../../context/AuthContext'
import { Sidebar } from './Sidebar'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderWithAuth(user: { id: number; name: string; email: string } | null) {
  const signOut = vi.fn()
  render(
    <AuthContext.Provider value={{ user, loading: false, signIn: vi.fn(), signUp: vi.fn(), signOut }}>
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  return { signOut }
}

describe('Sidebar', () => {
  it('shows Login link when user is not authenticated', () => {
    renderWithAuth(null)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Sair')).not.toBeInTheDocument()
    expect(screen.queryByText('Publicar')).not.toBeInTheDocument()
  })

  it('shows Sair button and Publicar when user is authenticated', () => {
    renderWithAuth({ id: 1, name: 'Test User', email: 'test@test.com' })
    expect(screen.getByText('Sair')).toBeInTheDocument()
    expect(screen.getByText('Publicar')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('calls signOut and navigates to /login when Sair is clicked', async () => {
    const { signOut } = renderWithAuth({ id: 1, name: 'Test', email: 't@t.com' })
    await userEvent.click(screen.getByText('Sair'))
    expect(signOut).toHaveBeenCalledOnce()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
