import { render, screen } from '@testing-library/react'
import { SocialLoginGroup } from './SocialLoginGroup'

const providers = [
  { iconSrc: '/github.svg', alt: 'GitHub', label: 'Github' },
  { iconSrc: '/google.svg', alt: 'Google', label: 'Gmail' },
]

test('renderiza todos os provedores', () => {
  render(<SocialLoginGroup providers={providers} />)
  expect(screen.getByText('Github')).toBeInTheDocument()
  expect(screen.getByText('Gmail')).toBeInTheDocument()
})
