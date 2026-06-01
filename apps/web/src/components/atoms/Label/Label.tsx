import type { LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string
}

export function Label({ children, htmlFor, className = '', ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1 block text-sm text-foreground ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
