import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { TextareaField } from './TextareaField'

test('renderiza label associada ao textarea pelo htmlFor', () => {
  render(
    <TextareaField id="description" label="Descrição" value="" onChange={() => {}} />
  )
  expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <TextareaField id="description-a11y" label="Descrição" value="" onChange={() => {}} placeholder="Conte mais sobre o seu post" />
  )
  expect(await axe(container)).toHaveNoViolations()
})
