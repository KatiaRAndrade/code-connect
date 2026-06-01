import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
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
