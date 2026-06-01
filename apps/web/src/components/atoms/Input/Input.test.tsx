import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

test('propaga onChange ao digitar', async () => {
  const handleChange = vi.fn()
  render(<Input id="email" onChange={handleChange} placeholder="email" />)
  await userEvent.type(screen.getByPlaceholderText('email'), 'a')
  expect(handleChange).toHaveBeenCalled()
})
