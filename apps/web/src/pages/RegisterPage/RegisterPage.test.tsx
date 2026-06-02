import { screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { renderWithRouter } from '../../test/render'
import { RegisterPage } from './RegisterPage'

test('renderiza heading Cadastro', () => {
  renderWithRouter(<RegisterPage />)
  expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = renderWithRouter(<RegisterPage />)
  expect(await axe(container)).toHaveNoViolations()
})
