import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

test('imprime os dados no console ao submeter', async () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  renderLoginForm()

  await userEvent.type(screen.getByLabelText('Email ou usuário'), 'test@email.com')
  await userEvent.type(screen.getByLabelText('Senha'), 'secret123')
  await userEvent.click(screen.getByRole('button', { name: /login/i }))

  expect(consoleSpy).toHaveBeenCalledWith({
    email: 'test@email.com',
    password: 'secret123',
    remember: false,
  })

  consoleSpy.mockRestore()
})
