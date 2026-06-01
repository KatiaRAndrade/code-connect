import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test/render'
import { LoginPage } from './LoginPage'

test('renderiza heading Login', () => {
  renderWithRouter(<LoginPage />)
  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
})
