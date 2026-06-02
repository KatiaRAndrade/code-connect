import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { RegisterForm } from './RegisterForm'

function renderRegisterForm() {
  return render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  )
}

test('imprime os dados no console ao submeter', async () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  renderRegisterForm()

  await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
  await userEvent.type(screen.getByLabelText('Email'), 'joao@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /cadastrar/i }))

  expect(consoleSpy).toHaveBeenCalledWith({
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'secret123',
    remember: false,
  })

  consoleSpy.mockRestore()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderRegisterForm()
  expect(await axe(container)).toHaveNoViolations()
})
