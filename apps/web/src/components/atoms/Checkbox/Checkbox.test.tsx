import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

test('chama onChange ao alternar', async () => {
  const handleChange = vi.fn()
  render(<Checkbox id="remember" label="Lembrar-me" checked={false} onChange={handleChange} />)
  await userEvent.click(screen.getByLabelText('Lembrar-me'))
  expect(handleChange).toHaveBeenCalledWith(true)
})
