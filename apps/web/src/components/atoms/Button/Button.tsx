import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rightIcon?: ReactNode
}

export function Button({ children, rightIcon, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 font-semibold text-black transition-[filter] hover:brightness-95 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  )
}
