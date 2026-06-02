import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { RememberMeRow } from './RememberMeRow'

test('renderiza checkbox e link de esqueci a senha', () => {
  render(
    <MemoryRouter>
      <RememberMeRow checked={false} onChange={() => {}} />
    </MemoryRouter>
  )
  expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <MemoryRouter>
      <RememberMeRow checked={false} onChange={() => {}} />
    </MemoryRouter>
  )
  expect(await axe(container)).toHaveNoViolations()
})
