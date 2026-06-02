import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Checkbox } from './Checkbox'

test('chama onChange ao alternar', async () => {
  const handleChange = vi.fn()
  render(<Checkbox id="remember" label="Lembrar-me" checked={false} onChange={handleChange} />)
  await userEvent.click(screen.getByLabelText('Lembrar-me'))
  expect(handleChange).toHaveBeenCalledWith(true)
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <Checkbox id="remember-a11y" label="Lembrar-me" checked={false} onChange={() => {}} />
  )
  expect(await axe(container)).toHaveNoViolations()
})
