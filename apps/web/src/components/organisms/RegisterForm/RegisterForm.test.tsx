import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { RegisterForm } from './RegisterForm'
import { AuthProvider } from '../../../context/AuthContext'
import * as authApi from '../../../api/auth'

vi.mock('../../../api/auth')

function renderRegisterForm() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(authApi.me).mockRejectedValue(new Error('no token'))
})

test('chama register com nome, email e senha ao submeter', async () => {
  vi.mocked(authApi.register).mockResolvedValue({ id: 1, name: 'João Silva', email: 'joao@email.com' })

  renderRegisterForm()

  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'joao@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

  expect(authApi.register).toHaveBeenCalledWith({
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'secret123',
  })
})

test('mostra mensagem de sucesso após cadastro', async () => {
  vi.mocked(authApi.register).mockResolvedValue({ id: 1, name: 'João Silva', email: 'joao@email.com' })

  renderRegisterForm()

  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'joao@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('Cadastro realizado com sucesso!')
  })
})

test('mostra mensagem de erro quando email já existe', async () => {
  const err = Object.assign(new Error(), {
    isAxiosError: true,
    response: { data: { message: 'Email já cadastrado' } },
  })
  vi.mocked(authApi.register).mockRejectedValue(err)

  renderRegisterForm()

  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'existente@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

test('desabilita o botão durante o envio', async () => {
  let resolve!: (v: authApi.PublicUser) => void
  vi.mocked(authApi.register).mockImplementation(
    () => new Promise<authApi.PublicUser>((res) => { resolve = res })
  )

  renderRegisterForm()

  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'joao@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

  expect(screen.getByRole('button', { name: /cadastrando/i })).toBeDisabled()
  resolve({ id: 1, name: 'João Silva', email: 'joao@email.com' })
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderRegisterForm()
  await waitFor(() => expect(screen.queryByText('Cadastrando...')).not.toBeInTheDocument())
  expect(await axe(container)).toHaveNoViolations()
})
