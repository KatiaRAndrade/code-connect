import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FormField } from './FormField'

test('renderiza label associada ao input pelo htmlFor', () => {
  render(
    <FormField id="email" label="Email ou usuário" value="" onChange={() => {}} />
  )
  expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <FormField id="email-a11y" label="Email" value="" onChange={() => {}} placeholder="email@exemplo.com" />
  )
  expect(await axe(container)).toHaveNoViolations()
})
