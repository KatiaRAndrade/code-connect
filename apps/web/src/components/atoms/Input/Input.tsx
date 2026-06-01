import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
}

export function Input({ id, className = '', ...props }: InputProps) {
  return (
    <input
      id={id}
      className={`w-full rounded-md bg-surface-input px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 ${className}`}
      {...props}
    />
  )
}
