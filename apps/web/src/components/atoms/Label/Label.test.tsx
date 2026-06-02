import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Label } from './Label'

test('renderiza texto e associa ao campo via htmlFor', () => {
  render(
    <>
      <Label htmlFor="email">Email</Label>
      <input id="email" />
    </>
  )
  expect(screen.getByText('Email')).toBeInTheDocument()
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <>
      <Label htmlFor="email-a11y">Email</Label>
      <input id="email-a11y" />
    </>
  )
  expect(await axe(container)).toHaveNoViolations()
})
