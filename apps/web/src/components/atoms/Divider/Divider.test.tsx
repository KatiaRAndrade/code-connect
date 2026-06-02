import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Divider } from './Divider'

test('renderiza texto entre as linhas quando children é fornecido', () => {
  render(<Divider>ou entre com outras contas</Divider>)
  expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA — com texto', async () => {
  const { container } = render(<Divider>ou entre com outras contas</Divider>)
  expect(await axe(container)).toHaveNoViolations()
})

test('não tem violações de acessibilidade WCAG 2 AA — sem texto', async () => {
  const { container } = render(<Divider />)
  expect(await axe(container)).toHaveNoViolations()
})
