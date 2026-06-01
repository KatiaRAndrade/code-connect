import { render, screen } from '@testing-library/react'
import { AuthLayout } from './AuthLayout'

test('renderiza banner e children nos seus slots', () => {
  render(
    <AuthLayout banner={<div>Banner</div>}>
      <p>Formulário</p>
    </AuthLayout>
  )
  expect(screen.getByText('Banner')).toBeInTheDocument()
  expect(screen.getByText('Formulário')).toBeInTheDocument()
})
