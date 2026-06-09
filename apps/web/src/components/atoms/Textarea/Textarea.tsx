import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
}

export function Textarea({ id, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      id={id}
      className={`w-full rounded-md bg-surface-input px-3 py-2 text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/40 ${className}`}
      {...props}
    />
  )
}
