import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Textarea } from './Textarea'

test('propaga onChange ao digitar', async () => {
  const handleChange = vi.fn()
  render(<Textarea id="description" onChange={handleChange} placeholder="descrição" />)
  await userEvent.type(screen.getByPlaceholderText('descrição'), 'a')
  expect(handleChange).toHaveBeenCalled()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <div>
      <label htmlFor="description-a11y">Descrição</label>
      <Textarea id="description-a11y" placeholder="descrição" />
    </div>
  )
  expect(await axe(container)).toHaveNoViolations()
})
