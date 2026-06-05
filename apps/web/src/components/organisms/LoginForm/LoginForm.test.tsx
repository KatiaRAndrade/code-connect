import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { LoginForm } from './LoginForm'
import { AuthProvider } from '../../../context/AuthContext'
import * as authApi from '../../../api/auth'

vi.mock('../../../api/auth')

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(authApi.me).mockRejectedValue(new Error('no token'))
})

test('chama login com email e senha ao submeter', async () => {
  vi.mocked(authApi.login).mockResolvedValue('fake-token')
  vi.mocked(authApi.me).mockResolvedValueOnce({ id: 1, name: 'Test', email: 'test@email.com' })

  renderLoginForm()

  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'test@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  expect(authApi.login).toHaveBeenCalledWith({ email: 'test@email.com', password: 'secret123' })
})

test('mostra mensagem de sucesso após login', async () => {
  vi.mocked(authApi.login).mockResolvedValue('fake-token')
  vi.mocked(authApi.me).mockResolvedValue({ id: 1, name: 'Test', email: 'test@email.com' })

  renderLoginForm()

  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'test@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('Login realizado com sucesso!')
  })
})

test('mostra mensagem de erro quando login falha', async () => {
  const err = Object.assign(new Error(), {
    isAxiosError: true,
    response: { data: { message: 'Credenciais inválidas' } },
  })
  vi.mocked(authApi.login).mockRejectedValue(err)

  renderLoginForm()

  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'wrong@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'wrongpass')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

test('desabilita o botão durante o envio', async () => {
  let resolve!: (v: string) => void
  vi.mocked(authApi.login).mockImplementation(
    () => new Promise<string>((res) => { resolve = res })
  )

  renderLoginForm()

  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'test@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled()
  resolve('fake-token')
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderLoginForm()
  await waitFor(() => expect(screen.queryByText('Entrando...')).not.toBeInTheDocument())
  expect(await axe(container)).toHaveNoViolations()
})
