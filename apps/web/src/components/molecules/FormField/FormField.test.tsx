import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'

test('renderiza label associada ao input pelo htmlFor', () => {
  render(
    <FormField id="email" label="Email ou usuário" value="" onChange={() => {}} />
  )
  expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
})
