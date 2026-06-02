import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { SocialIconButton } from './SocialIconButton'

test('chama onClick e exibe label', async () => {
  const handleClick = vi.fn()
  render(<SocialIconButton iconSrc="/github.svg" alt="GitHub" label="Github" onClick={handleClick} />)
  expect(screen.getByText('Github')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(
    <SocialIconButton iconSrc="/github.svg" alt="GitHub" label="Github" />
  )
  expect(await axe(container)).toHaveNoViolations()
})
