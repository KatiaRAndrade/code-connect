import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { renderWithRouter } from '../../test/render'
import { LoginPage } from './LoginPage'

test('renderiza heading Login', () => {
  renderWithRouter(<LoginPage />)
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderWithRouter(<LoginPage />)
  expect(await axe(container)).toHaveNoViolations()
})
