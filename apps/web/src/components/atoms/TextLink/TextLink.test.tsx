import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
