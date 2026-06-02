import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
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

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <AuthLayout banner={<img src="/banner.png" alt="Banner decorativo" />}>
      <div>
        <h1>Login</h1>
        <p>Faça seu login</p>
      </div>
    </AuthLayout>
  )
  expect(await axe(container)).toHaveNoViolations()
})
