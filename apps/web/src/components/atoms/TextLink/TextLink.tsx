import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface TextLinkProps {
  to?: string
  href?: string
  variant?: 'brand' | 'muted'
  children: ReactNode
  rightIcon?: ReactNode
}

export function TextLink({ to, href, variant = 'muted', children, rightIcon }: TextLinkProps) {
  const classes =
    variant === 'brand'
      ? 'text-brand font-medium hover:underline'
      : 'text-muted underline hover:text-foreground'

  const content = (
    <>
      {children}
      {rightIcon && <span aria-hidden="true" className="ml-1">{rightIcon}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`inline-flex items-center text-sm ${classes}`}>
        {content}
      </Link>
    )
  }

  return (
    <a href={href ?? '#'} className={`inline-flex items-center text-sm ${classes}`}>
      {content}
    </a>
  )
}
