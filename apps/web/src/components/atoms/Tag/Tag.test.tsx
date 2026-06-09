import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag label="React" />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('does not render remove button without onRemove', () => {
    render(<Tag label="TypeScript" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders remove button and calls onRemove on click', async () => {
    const onRemove = vi.fn()
    render(<Tag label="Vue" onRemove={onRemove} />)

    const btn = screen.getByRole('button', { name: /remover filtro vue/i })
    await userEvent.click(btn)
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('applies active variant styles', () => {
    render(<Tag label="Active" variant="active" />)
    const el = screen.getByText('Active').closest('span')
    expect(el?.className).toContain('bg-muted')
  })
})
