import { render, screen } from '@testing-library/react'
import { Divider } from './Divider'

test('renderiza texto entre as linhas quando children é fornecido', () => {
  render(<Divider>ou entre com outras contas</Divider>)
  expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
})
