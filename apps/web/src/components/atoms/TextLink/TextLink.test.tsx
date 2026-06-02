import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { TextLink } from './TextLink'

test('renderiza link com rota interna via to', () => {
  render(
    <MemoryRouter>
      <TextLink to="/cadastro" variant="brand">Crie seu cadastro!</TextLink>
    </MemoryRouter>
  )
  const link = screen.getByRole('link', { name: 'Crie seu cadastro!' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/cadastro')
})

test('não tem violações de acessibilidade WCAG 2 AA — rota interna', async () => {
  const { container } = render(
    <MemoryRouter>
      <TextLink to="/cadastro">Crie seu cadastro</TextLink>
    </MemoryRouter>
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('não tem violações de acessibilidade WCAG 2 AA — link externo', async () => {
  const { container } = render(
    <TextLink href="https://example.com">Saiba mais</TextLink>
  )
  expect(await axe(container)).toHaveNoViolations()
})
