import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

expect.extend(toHaveNoViolations)

configureAxe({
  rules: {
    'color-contrast': { enabled: false }, // jsdom não renderiza CSS real
  },
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
})
