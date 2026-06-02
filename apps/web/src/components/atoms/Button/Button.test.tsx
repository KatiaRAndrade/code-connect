import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from './Button'

test('chama onClick ao ser clicado', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Login</Button>)
  await userEvent.click(screen.getByRole('button', { name: 'Login' }))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(<Button>Entrar</Button>)
  expect(await axe(container)).toHaveNoViolations()
})
