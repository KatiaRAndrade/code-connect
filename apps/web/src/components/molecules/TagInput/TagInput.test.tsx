import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { useState } from 'react'
import { TagInput } from './TagInput'

function ControlledTagInput() {
  const [tags, setTags] = useState<string[]>([])
  return <TagInput id="tags" label="Tags" tags={tags} onChange={setTags} />
}

test('adiciona uma tag ao pressionar Enter', async () => {
  render(<ControlledTagInput />)

  const input = screen.getByLabelText('Tags')
  await userEvent.type(input, 'React{Enter}')

  expect(screen.getByText('React')).toBeInTheDocument()
  expect(input).toHaveValue('')
})

test('remove uma tag ao clicar no botão de remover', async () => {
  render(<ControlledTagInput />)

  const input = screen.getByLabelText('Tags')
  await userEvent.type(input, 'React{Enter}')
  expect(screen.getByText('React')).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /remover/i }))
  expect(screen.queryByText('React')).not.toBeInTheDocument()
})

test('não tem violações de acessibilidade WCAG 2 AA', async () => {
  const { container } = render(<ControlledTagInput />)
  expect(await axe(container)).toHaveNoViolations()
})
