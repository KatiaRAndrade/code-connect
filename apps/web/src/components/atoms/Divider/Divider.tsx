import type { ReactNode } from 'react'

interface DividerProps {
  children?: ReactNode
}

export function Divider({ children }: DividerProps) {
  if (!children) {
    return <hr className="border-surface-divider" />
  }

  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-surface-divider" />
      <span className="text-xs text-muted">{children}</span>
      <hr className="flex-1 border-surface-divider" />
    </div>
  )
}
