import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Input } from './Input'

test('propaga onChange ao digitar', async () => {
  const handleChange = vi.fn()
  render(<Input id="email" onChange={handleChange} placeholder="email" />)
  await userEvent.type(screen.getByPlaceholderText('email'), 'a')
  expect(handleChange).toHaveBeenCalled()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    // Input isolado deve ter label associada para ser acessível
    <div>
      <label htmlFor="email-a11y">Email</label>
      <Input id="email-a11y" placeholder="email" />
    </div>
  )
  expect(await axe(container)).toHaveNoViolations()
})
