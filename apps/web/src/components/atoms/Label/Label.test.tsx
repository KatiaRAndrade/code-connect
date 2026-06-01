import { render, screen } from '@testing-library/react'
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
